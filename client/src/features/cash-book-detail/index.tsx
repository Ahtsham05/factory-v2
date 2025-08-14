import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { getTodayAndPreviousBalanceByDate } from "@/stores/transaction.slice";
import { AppDispatch } from "@/stores/store";
import { useTranslations } from "@/hooks/use-translations";
import { useUrduFontStyle } from "@/hooks/use-urdu-font";
import { Button } from "@/components/ui/button";
import TransactionActionDialog from "@/features/transactions/components/users-action-dialog";

const CashBookDetail = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetch, setFetch] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t, currentLanguage } = useTranslations();
  const { getUrduClassName } = useUrduFontStyle();
  const isRTL = currentLanguage === 'ur';

  // Helper function to format numbers for RTL
  const formatNumber = (num: number) => {
    if (isRTL && num < 0) {
      return `- ${Math.abs(num)}`;
    }
    return num.toString();
  };
  useEffect(() => {
    setLoading(true);
    (dispatch(getTodayAndPreviousBalanceByDate({ date: date.toISOString().slice(0, 10) })) as any)
      .then((data: any) => {
        setTransactions(data.payload?.todayTransactions ?? []);
        setPreviousBalance(data.payload?.previousBalance ?? 0);
        setLoading(false);
      });
  }, [date, fetch]);

  // Filter transactions
  const debitTransactions = transactions.filter(txn => txn.debit > 0);
  const creditTransactions = transactions.filter(txn => txn.credit > 0);

  // Totals for debit table
  let debitBalance = 0;
  let totalDebit = 0;
  let totalDebitQty = 0;

  // Totals for credit table
  let grandBalance = previousBalance;
  let creditBalance = 0;
  let totalCredit = 0;
  let totalCreditQty = 0;

  return (
    <>
      {loading ? (
        <div className="w-full h-[70vh] flex items-center justify-center">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <div className={`${getUrduClassName()} ${isRTL ? 'rtl' : 'ltr'} px-10`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold my-4">{t('cashBook.title')}</h2>
            <h2 className="text-xl font-bold my-4">{t('cashBook.previousBalance')}: {previousBalance}</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <input
              type="date"
              value={date.toISOString().slice(0, 10)}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1"
            />
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-black hover:bg-black text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('transactions.addTransaction')}
            </Button>
          </div>
          {/* Debit Transactions Table */}
          <h3 className="text-lg font-semibold my-2">{t('cashBook.receivedTransactions')}</h3>
          <table className="w-full border-collapse border border-gray-300 cursor-pointer mb-8">
            <thead>
              <tr>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.date')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.party')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.description')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('transactions.transactionId')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.qty')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.price')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.debit')}</th>
                {/* <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.credit')}</th> */}
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {debitTransactions.map((txn, idx) => {
                debitBalance += txn.debit;
                totalDebit += txn.debit;
                totalDebitQty += txn.qty ? txn.qty : 0;
                grandBalance += txn.debit - txn.credit;
                return (
                  <tr className="hover:bg-gray-100 hover:dark:bg-gray-700" key={idx}>
                    <td className="px-2 border border-black">{new Date(txn.transactionDate).toLocaleDateString("en-GB", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}</td>
                    <td className="px-2 border border-black">{txn?.account?.name}</td>
                    <td className="px-2 border border-black">{txn.description}</td>
                    <td className="px-2 border border-black">{txn.transactionId}</td>
                    <td className="px-2 border border-black">{txn.qty}</td>
                    <td className="px-2 border border-black">{txn.price}</td>
                    <td className="px-2 border border-black">{txn.debit}</td>
                    {/* <td className="px-2 border border-black">{txn.credit}</td> */}
                    <td className="px-2 border border-black">{formatNumber(grandBalance)}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 dark:bg-gray-700">
                <td className={`px-2 border border-black font-bold ${isRTL ? 'text-left' : 'text-right'}`} colSpan={4}>{t('cashBook.grandTotal')}:</td>
                <td className="px-2 border border-black font-bold">{totalDebitQty}</td>
                <td className="px-2 border border-black font-bold"></td>
                <td className="px-2 border border-black font-bold">{totalDebit}</td>
                {/* <td className="px-2 border border-black font-bold">{totalCredit}</td> */}
                <td className="px-2 border border-black font-bold">{formatNumber(grandBalance)}</td>
              </tr>
            </tbody>
          </table>

          {/* Credit Transactions Table */}
          <h3 className="text-lg font-semibold my-2">{t('cashBook.payTransactions')}</h3>
          <table className="w-full border-collapse border border-gray-300 cursor-pointer">
            <thead>
              <tr>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.date')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.party')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.description')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('transactions.transactionId')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.qty')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.price')}</th>
                {/* <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.debit')}</th> */}
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.credit')}</th>
                <th className={`px-2 py-1 border border-black ${isRTL ? 'text-right' : 'text-left'}`}>{t('cashBook.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {creditTransactions.map((txn, idx) => {
                creditBalance -= txn.credit;
                totalCredit += txn.credit;
                totalCreditQty += txn.qty ? txn.qty : 0;
                grandBalance += txn.debit - txn.credit;
                return (
                  <tr className="hover:bg-gray-100 hover:dark:bg-gray-700" key={idx}>
                    <td className="px-2 border border-black">{new Date(txn.transactionDate).toLocaleDateString("en-GB", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}</td>
                    <td className="px-2 border border-black">{txn.description}</td>
                    <td className="px-2 border border-black">{txn?.account?.name}</td>
                    <td className="px-2 border border-black">{txn.transactionId}</td>
                    <td className="px-2 border border-black">{txn.qty}</td>
                    <td className="px-2 border border-black">{txn.price}</td>
                    {/* <td className="px-2 border border-black">{txn.debit}</td> */}
                    <td className="px-2 border border-black">{txn.credit}</td>
                    <td className="px-2 border border-black">{formatNumber(grandBalance)}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 dark:bg-gray-700">
                <td className={`px-2 border border-black font-bold ${isRTL ? 'text-left' : 'text-right'}`} colSpan={4}>{t('cashBook.grandTotal')}:</td>
                <td className="px-2 border border-black font-bold">{totalCreditQty}</td>
                <td className="px-2 border border-black font-bold"></td>
                {/* <td className="px-2 border border-black font-bold">{totalDebit}</td> */}
                <td className="px-2 border border-black font-bold">{totalCredit}</td>
                <td className="px-2 border border-black font-bold">{formatNumber(grandBalance)}</td>
              </tr>
              {/* <tr className="hover:bg-gray-100">
                <td className="px-2 border border-black font-bold text-right" colSpan={3}>Net Total:</td>
                <td className="px-2 border border-black font-bold">{totalDebitQty}</td>
                <td className="px-2 border border-black font-bold"></td>
                <td className="px-2 border border-black font-bold">{totalDebit}</td>
                <td className="px-2 border border-black font-bold">{totalCredit}</td>
                <td className="px-2 border border-black font-bold">{grandBalance}</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Transaction Dialog */}
      <TransactionActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        setFetch={setFetch}
      />
    </>
  );
};

export default CashBookDetail;
























// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { getTodayAndPreviousBalance } from "@/stores/transaction.slice";
// import { AppDispatch } from "@/stores/store";

// const CashBookDetail = () => {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [previousBalance, setPreviousBalance] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch<AppDispatch>()
//   useEffect(() => {
//     setLoading(true);
//     (dispatch(getTodayAndPreviousBalance({})) as any)
//       .then((data: any) => {
//         setTransactions(data.payload?.todayTransactions ?? []);
//         setPreviousBalance(data.payload?.previousBalance ?? 0);
//         setLoading(false);
//       });
//   }, []);

//   let balance = previousBalance;
//   let totalDebit = 0;
//   let totalCredit = 0;
//   let totalQty= 0;

//   return (
//     <>
//       {loading ? (
//         <div className="w-full h-[70vh] flex items-center justify-center">
//           <Loader2 className="animate-spin size-6" />
//         </div>
//       ) : (
//         <div>
//           <div className="flex justify-between items-center px-2">
//             <h2 className="text-xl font-bold my-4">Cash Book</h2>
//             <h2 className="text-xl font-bold my-4">Previous Balance: {previousBalance}</h2>
//           </div>
//           <table className="w-full border-collapse border border-gray-300 cursor-pointer">
//             <thead>
//               <tr>
//                 <th className="px-2 py-1 text-left border border-black">Date</th>
//                 <th className="px-2 py-1 text-left border border-black">Description</th>
//                 <th className="px-2 py-1 text-left border border-black">Qty</th>
//                 <th className="px-2 py-1 text-left border border-black">Price</th>
//                 <th className="px-2 py-1 text-left border border-black">Debit</th>
//                 <th className="px-2 py-1 text-left border border-black">Credit</th>
//                 <th className="px-2 py-1 text-left border border-black">Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((txn, idx) => {
//                 balance += txn.debit - txn.credit;
//                 totalDebit += txn.debit;
//                 totalCredit += txn.credit;
//                 totalQty += txn.qty ? txn.qty : 0
//                 return (
//                   <tr className="hover:bg-gray-100" key={idx}>
//                     <td className="px-2 border border-black">{new Date(txn.transactionDate).toLocaleDateString()}</td>
//                     <td className="px-2 border border-black">{txn.description}</td>
//                     <td className="px-2 border border-black">{txn.qty}</td>
//                     <td className="px-2 border border-black">{txn.price}</td>
//                     <td className="px-2 border border-black">{txn.debit}</td>
//                     <td className="px-2 border border-black">{txn.credit}</td>
//                     <td className="px-2 border border-black">{balance}</td>
//                   </tr>
//                 );
//               })}
//               <tr className="hover:bg-gray-100">
//                 <td className="px-2 border border-black font-bold text-right" colSpan={2}>Grand Total:</td>
//                 <td className="px-2 border border-black font-bold">{totalQty}</td>
//                 <td className="px-2 border border-black font-bold"></td>
//                 <td className="px-2 border border-black font-bold">{totalDebit}</td>
//                 <td className="px-2 border border-black font-bold">{totalCredit}</td>
//                 <td className="px-2 border border-black font-bold">{balance}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </>
//   );
// };

// export default CashBookDetail;