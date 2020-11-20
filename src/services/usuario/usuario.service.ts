import { EmailStaticService } from './../statics/email.static.service';
import { logger } from './../../main';
import { RequisicaoHash } from './../../entities/login.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { variaveisAmbiente } from 'src/configs/constants.config';
import { capitalize } from 'src/utils/string.util';
import { UpdateResponse } from '../../entities/update-response.entity';
import { HttpStatusCodeEnum } from '../../enums/http-code.enum';
import { Hash } from '../../schemas/hash.schema';
import { Usuario, UsuarioDocument } from '../../schemas/usuario.schema';
import { HashService } from '../hash.service';
import { SenhaService } from '../senha.service';
import { UsuarioConsultaService } from './usuario.consulta.service';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private usuarioConsultaService: UsuarioConsultaService,
    private senhaService: SenhaService,
    private hashService: HashService,
    private mailerService: MailerService
  ) { }

  async cadastrar(usuario: Usuario): Promise<Usuario> {

    usuario.email = usuario.email.toLowerCase();
    usuario.nome = capitalize(usuario.nome);

    const usuariosCadastrados = await this.usuarioConsultaService
      .consultarPorEmailOuTelefone(usuario.email, usuario.telefone);

    if (usuariosCadastrados.length > 0) {

      let mensagens: string[] = [];
      usuariosCadastrados.forEach(usuarioCadastrado => {

        if (usuarioCadastrado.email === usuario.email) {

          mensagens.push(`Email '${usuario.email}' já vinculado a outro usuário.`);
        }
        if (usuarioCadastrado.telefone === usuario.telefone) {

          mensagens.push(`Telefone '${usuario.telefone}' já vinculado a outro usuário.`);
        }
      });
      throw new HttpException(mensagens.join(' - '), HttpStatusCodeEnum.BAD_REQUEST)
    }

    usuario._id = undefined;
    usuario.senha = this.senhaService.encriptSenha(usuario.senha);
    usuario.acessos = ['geral'];
    usuario = await new this.usuarioModel(usuario).save();
    this.enviarEmailLinkValidacaoEmail(usuario);
    return usuario;
  }

  async atualizar(usuario: Usuario, _id = usuario._id): Promise<UpdateResponse> {

    let usuarioAtual: Usuario;
    try {
      usuarioAtual = await this.validarUsuario(undefined, undefined, _id);
    } catch (error) {
      throw error;
    }

    if (usuarioAtual.senha !== usuario.senha) {

      usuario.senha = this.senhaService.encriptSenha(usuario.senha);
    }

    return await this.usuarioModel.updateOne({ _id }, usuario);
  }

  async validarEmail(requisicao: RequisicaoHash): Promise<{ email: string }> {

    let usuario: Usuario;
    try {
      usuario = await this.usuarioConsultaService.consultarPorHash(requisicao.hash, 'email');
    } catch (error) {
      throw error;
    }

    await this.hashService.excluirPorId(requisicao.hash);
    await this.usuarioModel.updateOne({ _id: usuario._id }, { emailValidado: true })
    return { email: usuario.email };
  }

  async redefinirSenha(requisicao: RequisicaoHash): Promise<UpdateResponse> {

    let usuario: Usuario;
    try {
      usuario = await this.usuarioConsultaService.consultarPorHash(requisicao.hash, 'senha');
    } catch (error) {
      throw error;
    }

    const senha = this.senhaService.encriptSenha(requisicao.senha);
    return await this.usuarioModel.updateOne({ _id: usuario._id }, { senha });
  }

  async enviarEmailLinkRedefinicaoSenha(email: string): Promise<void> {

    let usuario: Usuario;
    try {
      usuario = await this.validarUsuario(email);
    } catch (error) {
      throw error;
    }

    let link: string;
    try {
      link = await this.gerarLinkredefinicaoSenha(usuario._id);
    } catch (error) {
      throw error;
    }

    this.senhaService.enviarEmailRedifinicaoSenha(usuario.nome, usuario.email, link);
  }

  async enviarEmailLinkValidacaoEmail(usuario: Usuario): Promise<void> {

    let link: string;
    try {
      link = await this.gerarLinkValidacaoEmail(usuario._id);
    } catch (error) {
      throw error;
    }

    await this.mailerService
      .sendMail({
        to: usuario.email,
        subject: 'Confirmação de E-mail SistemaFelipe',
        html: EmailStaticService.getHtmlEmailTeplateSenhaEmail(usuario.nome, link, 'email'),
      });
  }

  async gerarLinkredefinicaoSenha(_id: Types.ObjectId) {

    let hash: Hash;
    try {
      hash = await this.hashService.cadastrar(_id, 'senha');
    } catch (error) {
      throw error;
    }

    return `${variaveisAmbiente.frontend}/redefinicao-senha?hash=${hash._id}`;
  }

  async gerarLinkValidacaoEmail(_id: Types.ObjectId) {

    let hash: Hash;
    try {
      hash = await this.hashService.cadastrar(_id, 'email');
    } catch (error) {
      throw error;
    }

    return `${variaveisAmbiente.frontend}/validacao-email?hash=${hash._id}`;
  }

  async excluirUsuarioPorId(_id: string): Promise<UpdateResponse> {

    return this.usuarioModel.deleteOne({ _id });
  }

  async excluirTodos(): Promise<UpdateResponse> {

    return this.usuarioModel.deleteMany({});
  }

  /**
   * @description Valida se o id passado por parâmentro pertence a um usuário cadastrado na base
   */
  async validarUsuario(email: string, telefone?: string, _id?: Types.ObjectId): Promise<Usuario> {

    let usuarioAtual: Usuario;
    if (_id) {

      if (!isValidObjectId(_id)) {

        throw new HttpException('Usuário não encontrado', HttpStatusCodeEnum.NOT_FOUND);
      }

      usuarioAtual = await this.usuarioModel.findOne({ _id });
    } else {

      if (!email && !telefone) {

        throw new HttpException(`Informe o '_id', 'email' ou 'tellefone'`, HttpStatusCodeEnum.BAD_REQUEST);
      }

      if (email) {

        usuarioAtual = await this.usuarioConsultaService.consultarPorEmail(email);
      } else {

        usuarioAtual = await this.usuarioConsultaService.consultarPorTelefone(email);
      }
    }

    if (!usuarioAtual) {

      throw new HttpException('Usuário não encontrado', HttpStatusCodeEnum.NOT_FOUND);
    }

    return usuarioAtual;
  }
}
