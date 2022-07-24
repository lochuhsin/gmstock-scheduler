import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import settings from 'src/config';

@Injectable()
export class FinMindService {
  constructor(private readonly httpService: HttpService) {}
  url = 'https://api.finmindtrade.com/api/v4/data?';
  token = settings.token['finMind'];

  testFunc() {
    console.log('hello world');
  }
  async TaiwanStockInfo() {
    return await this.httpService.axiosRef.get(this.url, {
      params: { dataset: 'TaiwanStockInfo' },
    });
  }

  async TaiwanDailyShortSaleBalances(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanDailyShortSaleBalances',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  // id = TAIEX or TPEx
  async getTaiwanStockTotalReturnIndex(
    id: string = 'TPEx',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockTotalReturnIndex',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  async getTaiwanStockTotalMarginPurchaseShortSale(
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockTotalMarginPurchaseShortSale',
        start_date: startDate,
        token: this.token,
      },
    });
  }

  async getTaiwanStockMarginPurchaseShortSale(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockTotalMarginPurchaseShortSale',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  async TaiwanStockInstitutionalInvestorsBuySell(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockInstitutionalInvestorsBuySell',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  async TaiwanStockTotalInstitutionalInvestors(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockTotalInstitutionalInvestors',
        // data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  // 外資持股表
  async TaiwanStockShareholding(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockShareholding',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  // 股權持股分級表
  async TaiwanStockHoldingSharesPer(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockHoldingSharesPer',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  // 綜合損益表
  async TaiwanStockFinancialStatements(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockFinancialStatements',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  //現金流量表
  async TaiwanStockCashFlowsStatement(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockCashFlowsStatement',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  // 資產負債表
  async TaiwanStockBalanceSheet(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockBalanceSheet',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  // 股利政策表
  async TaiwanStockDividend(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockDividend',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  //除權除息結果表
  async TaiwanStockDividendResult(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockDividendResult',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  //月營收表 id = Stock ids : 1101, 1102 ...etc
  async TaiwanStockMonthRevenue(
    id: string = '2331',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanStockMonthRevenue',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  // 台幣 vs 他國 匯率
  async TaiwanExchangeRate(
    id: string = 'SGD',
    startDate: string = '2021-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'TaiwanExchangeRate',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }
  // 黃金匯率
  async GoldPrice(startDate: string = '2021-06-01') {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'GoldPrice',
        start_date: startDate,
        token: this.token,
      },
    });
  }

  // 原油  id = WTI or Brent
  async CrudeOilPrices(id: string = 'Brent', startDate: string = '2022-06-01') {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'CrudeOilPrices',
        data_id: 'Brent',
        start_date: startDate,
        token: this.token,
      },
    });
  }

  //美國 國債
  async GovernmentBondsYield(
    id: string = 'United States 1-Month',
    startDate: string = '2022-06-01',
  ) {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'GovernmentBondsYield',
        data_id: id,
        start_date: startDate,
        token: this.token,
      },
    });
  }

  //恐懼 貪婪指數
  async FearGreedIndex(startDate = '2022-01-01') {
    return await this.httpService.axiosRef.get(this.url, {
      params: {
        dataset: 'CnnFearGreedIndex',
        start_date: startDate,
        token: this.token,
      },
    });
  }
}
