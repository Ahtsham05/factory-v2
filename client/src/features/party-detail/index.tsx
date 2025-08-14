import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';
import { AppDispatch } from "@/stores/store";
import { getAllSupplierBalances, getTodayAndPreviousBalanceByDate } from "@/stores/transaction.slice";

const PartyDetail = () => {
  const { t } = useTranslation();
  const { isUrdu, urduFontStyle, urduTableCellStyle } = useUrduFontStyle();
  
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);

useEffect(() => {
  setLoading(true);
  dispatch(getAllSupplierBalances({}) as any).then((res: any) => {
    setParties(res.payload);
    setLoading(false);
  });

  dispatch(getTodayAndPreviousBalanceByDate({ date: nextDate.toISOString().slice(0, 10) }) as any)
    .then(() => {
      setLoading(false);
    });
}, []);

  const payableParties = parties.filter(party => party.status === "payable");
  const receivableParties = parties.filter(party => party.status === "receivable");

  let totalPayableDebit = 0;
  let totalPayableCredit = 0;
  let totalPayableBalance = 0;
  let totalReceivableDebit = 0;
  let totalReceivableCredit = 0;
  let totalReceivableBalance = 0;

  return (
    <>
      {loading ? (
        <div className="w-full h-[70vh] flex items-center justify-center">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <div className={`${isUrdu ? 'rtl' : 'ltr'} px-4`}>
          <h2 className="text-xl font-bold my-4" style={urduFontStyle}>
            {t('partyDetail.payableParties')}
          </h2>
          <table className="w-full border-collapse border border-gray-300 cursor-pointer mb-8">
            <thead>
              <tr>
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.partyName')}
                </th>
                {/* <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.debit')}
                </th>
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.credit')}
                </th> */}
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.balance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {payableParties.map((party, idx) => {
                totalPayableDebit += party.totalDebit;
                totalPayableCredit += party.totalCredit;
                totalPayableBalance += party.balance;
                return (
                <tr className="hover:bg-gray-100 hover:dark:bg-gray-700" key={party._id || idx}>
                  <td className="px-2 border border-black" style={urduTableCellStyle}>{party.name}</td>
                  {/* <td className="px-2 border border-black" style={urduTableCellStyle}>{party.totalDebit}</td>
                  <td className="px-2 border border-black" style={urduTableCellStyle}>{party.totalCredit}</td> */}
                  <td className="px-2 border border-black" style={urduTableCellStyle}>{party.balance}</td>
                </tr>
              )
              })}
              {/* <tr className="font-bold bg-gray-200 dark:bg-gray-700">
                <td className={`px-2 border border-black ${isUrdu ? 'text-left' : 'text-right'}`} style={urduTableCellStyle}>
                  {t('partyDetail.grandTotal')}:
                </td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalPayableDebit}</td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalPayableCredit}</td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalPayableBalance}</td>
              </tr> */}
            </tbody>
          </table>

          <h2 className="text-xl font-bold my-4" style={urduFontStyle}>
            {t('partyDetail.receivableParties')}
          </h2>
          <table className="w-full border-collapse border border-gray-300 cursor-pointer">
            <thead>
              <tr>
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.partyName')}
                </th>
                {/* <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.debit')}
                </th>
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.credit')}
                </th> */}
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.balance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {receivableParties.map((party, idx) => {
                totalReceivableDebit += party.totalDebit;
                totalReceivableCredit += party.totalCredit;
                totalReceivableBalance += party.balance;
                return (
                <tr className="hover:bg-gray-100 hover:dark:bg-gray-700" key={party._id || idx}>
                  <td className="px-2 border border-black" style={urduTableCellStyle}>{party.name}</td>
                  {/* <td className="px-2 border border-black" style={urduTableCellStyle}>{party.totalDebit}</td>
                  <td className="px-2 border border-black" style={urduTableCellStyle}>{party.totalCredit}</td> */}
                  <td className="px-2 border border-black" style={urduTableCellStyle}>{party.balance}</td>
                </tr>
              )
              })}
              {/* <tr className="font-bold bg-gray-200 dark:bg-gray-700">
                <td className={`px-2 border border-black ${isUrdu ? 'text-left' : 'text-right'}`} style={urduTableCellStyle}>
                  {t('partyDetail.grandTotal')}:
                </td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalReceivableDebit}</td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalReceivableCredit}</td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalReceivableBalance}</td>
              </tr> */}
            </tbody>
          </table>

          <h2 className="text-xl font-bold my-4" style={urduFontStyle}>
            {t('partyDetail.summary')}
          </h2>
          <table className="w-full border-collapse border border-gray-300 cursor-pointer">
            <thead>
              <tr>
                {/* <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.cashBook')}
                </th> */}
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.totalPayable')}
                </th>
                <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.totalReceivable')}
                </th>
                {/* <th className={`px-2 py-1 ${isUrdu ? 'text-right' : 'text-left'} border border-black`} style={urduTableCellStyle}>
                  {t('partyDetail.balance')}
                </th> */}
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold bg-gray-200 dark:bg-gray-700">
                {/* <td className="px-2 border border-black" style={urduTableCellStyle}>{cashBook}</td> */}
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalPayableBalance}</td>
                <td className="px-2 border border-black" style={urduTableCellStyle}>{totalReceivableBalance}</td>
                {/* <td className="px-2 border border-black" style={urduTableCellStyle}>{totalPayableBalance + totalReceivableBalance}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default PartyDetail;