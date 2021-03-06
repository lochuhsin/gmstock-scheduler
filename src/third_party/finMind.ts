import axios from 'axios';
import settings from '../config';

// https://finmind.github.io/
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FinMind {
  const _URL = 'https://api.finmindtrade.com/api/v4/data?';
  const _TOKEN = settings.token['finMind'];

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
  // ???????????????
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
  // ?????????????????????
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
  // ???????????????
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
  //???????????????
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
  // ???????????????
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

  // ???????????????
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

  //?????????????????????
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

  //???????????? id = Stock ids : 1101, 1102 ...etc
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
  // ?????? vs ?????? ??????
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
  // ????????????
  export async function GoldPrice(startDate:string = '2021-06-01') {
    return await axios.get(_URL, {
      params: {
        dataset: 'GoldPrice',
        start_date: startDate,
        token: _TOKEN,
      },
    });
  }

  // ??????  id = WTI or Brent
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

  //?????? ??????
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

  //?????? ????????????
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
