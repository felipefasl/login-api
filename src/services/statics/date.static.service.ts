/**
 * @description Serviço para manipulação de Date
 */
export class DateStaticService {

  /**
   * @description Compara duas datas
   * @param data1 data a ser comparada com a data2
   * @param data2  data a ser comparada com a data1
   * @returns 0 datas iguais, 1 data1 maior que data2, 2 data2 maior que data1
   * @example
   * compararDatas(new Date('2020-10-20'), new Date('2019-10-20')) => return 0
   * compararDatas(new Date('2020-10-21'), new Date('2019-10-20')) => return 1
   * compararDatas(new Date('2020-10-20'), new Date('2019-10-21')) => return 2
   */
  public static compararDatas(data1: Date, data2: Date): number {

    if (data1.getFullYear() > data2.getFullYear()) {

      return 1;
    } else {

      if (data1.getFullYear() < data2.getFullYear()) {

        return 2;
      } else {

        if (data1.getMonth() > data2.getMonth()) {

          return 1;
        } else {

          if (data1.getMonth() < data2.getMonth()) {

            return 2;
          } else {

            if (data1.getDate() > data2.getDate()) {

              return 1;
            } else {

              if (data1.getDate() < data2.getDate()) {

                return 2;
              } else {

                return 0;
              }
            }
          }
        }
      }
    }
  }

  /**
   * @description Transforma data em string
   * @param date Data a ser formatada
   * @returns retorna string no formato 'dd.mm.yyyy'
   * @example dataParaString(new Date(2019, 8, 5)) => return '05.09.2019'
   */
  static formatarDateParaString(date: Date, separador = '/'): string {

    if (date) {

      const data = date;
      let dia = data.getDate().toString();
      if (dia.length === 1) {

        dia = '0' + dia;
      }
      let mes = (data.getMonth() + 1).toString();
      if (mes.toString().length === 1) {

        mes = '0' + mes;
      }
      const ano = data.getFullYear();
      return dia + separador + mes + separador + ano;
    }
    return undefined;
  }
}
