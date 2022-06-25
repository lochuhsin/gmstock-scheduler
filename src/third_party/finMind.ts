import axios from 'axios';

// for deeper insight of dataset https://finmindtrade.com/analysis/#/data/document
// https://finmind.github.io/
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace finMind {
  const _URL = 'https://api.finmindtrade.com/api/v4/data?';
  const _TOKEN =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMi0wNi0yMyAyMDoxNzowMyIsInVzZXJfaWQiOiJsb2NodWhzaW4iLCJpcCI6IjExNC4xMzYuNTguMTE1In0.tWMyITWi1PXdSGZGFuE_RcrUKtLYcsrP3DHgnlhZ6oc';

  export function testFunc() {
    console.log('hello world');
  }
  export async function TaiwanStockInfo() {
    return await axios.get(_URL, { params: { dataset: 'TaiwanStockInfo' } });
  }

  export async function TaiwanDailyShortSaleBalances(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanDailyShortSaleBalances',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  // id = TAIEX or TPEx
  export async function getTaiwanStockTotalReturnIndex(id:string = 'TPEx', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockTotalReturnIndex',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  export async function getTaiwanStockTotalMarginPurchaseShortSale(startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockTotalMarginPurchaseShortSale',
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  export async function getTaiwanStockMarginPurchaseShortSale(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockTotalMarginPurchaseShortSale',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  export async function TaiwanStockInstitutionalInvestorsBuySell(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockInstitutionalInvestorsBuySell',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  export async function TaiwanStockTotalInstitutionalInvestors(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockTotalInstitutionalInvestors',
        // data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  // 外資持股表
  export async function TaiwanStockShareholding(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockShareholding',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  // 股權持股分級表
  export async function TaiwanStockHoldingSharesPer(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockHoldingSharesPer',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  // 綜合損益表
  export async function TaiwanStockFinancialStatements(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockFinancialStatements',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  //現金流量表
  export async function TaiwanStockCashFlowsStatement(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockCashFlowsStatement',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  // 資產負債表
  export async function TaiwanStockBalanceSheet(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockBalanceSheet',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  // 股利政策表
  export async function TaiwanStockDividend(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockDividend',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  //除權除息結果表
  export async function TaiwanStockDividendResult(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockDividendResult',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  //月營收表 id = Stock ids : 1101, 1102 ...etc
  export async function TaiwanStockMonthRevenue(id:string = '2331', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanStockMonthRevenue',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  // 台幣 vs 他國 匯率
  export async function TaiwanExchangeRate(id:string = 'SGD', startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'TaiwanExchangeRate',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
  // 黃金匯率
  export async function GoldPrice(startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'GoldPrice',
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  // 原油  id = WTI or Brent
  export async function CrudeOilPrices(id:string = 'Brent', startDate:string = '2022-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'CrudeOilPrices',
        data_id: 'Brent',
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  //美國 國債
  export async function GovernmentBondsYield(id:string = 'United States 1-Month', startDate:string = '2022-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'GovernmentBondsYield',
        data_id: id,
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  //恐懼 貪婪指數
  export async function FearGreedIndex(startDate = '2022-01-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'CnnFearGreedIndex',
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }
}
