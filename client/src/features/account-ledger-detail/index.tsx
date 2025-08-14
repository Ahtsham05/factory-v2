import { Loader2, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';
import { useNavigate } from '@tanstack/react-router';
import { AppDispatch } from "@/stores/store";
import { getAccountTransactionsWithPreviousBalance } from "@/stores/transaction.slice";
import TransactionsProvider from '@/features/transactions/context/users-context';
import TransactionPrimaryButtons from '@/features/transactions/components/users-primary-buttons';
import TransactionsDialogs from '@/features/transactions/components/users-dialogs';
import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const AccountLedgerDetail = () => {
  const { t } = useTranslation();
  const { isUrdu, urduFontStyle } = useUrduFontStyle();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [fetch, setFetch] = useState(false);
  
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const accountId = searchParams.get('account');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const [transactions, setTransactions] = useState<any[]>([]);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!accountId || !startDate || !endDate) return;
    setLoading(true);
    dispatch(getAccountTransactionsWithPreviousBalance({ accountId, startDate, endDate }) as any)
      .then((action: any) => {
        const data = action.payload;
        setPreviousBalance(data?.previousBalance ?? 0);
        setTransactions(data?.transactions ?? []);
        setLoading(false);
        setAccountDetails(data?.account);
      });
  }, [accountId, startDate, endDate, dispatch, fetch]);

  const generateUniqueCode = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${timestamp}${random}`;
  };

  const exportToPDF = async () => {
    if (!accountDetails) {
      console.log('Missing accountDetails');
      return;
    }
    
    console.log('Starting PDF export...');
    setIsExporting(true);
    
    try {
      console.log('Transactions to include:', transactions.length);
      console.log('Transaction data:', transactions);
      
      if (isUrdu) {
        // For Urdu, use html2canvas to capture the rendered browser view with proper fonts
        const element = contentRef.current;
        if (!element) {
          console.error('Content element not found');
          return;
        }

        // Hide buttons during capture
        const buttons = element.querySelectorAll('[data-export-button], [data-back-button]');
        buttons.forEach(btn => {
          (btn as HTMLElement).style.display = 'none';
        });

        // Create a temporary style element to override oklch colors and ensure Urdu font
        const tempStyle = document.createElement('style');
        tempStyle.innerHTML = `
          /* Override all potential oklch and modern color functions */
          * {
            background-color: white !important;
            color: black !important;
            border-color: black !important;
            outline-color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
            accent-color: #000000 !important;
            caret-color: black !important;
            column-rule-color: black !important;
            text-decoration-color: black !important;
            font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif !important;
            font-size: 1em !important;
            line-height: 1.6 !important;
            font-weight: 400 !important;
            font-optical-sizing: auto !important;
            font-style: normal !important;
          }
          
          /* Specific overrides for common UI elements */
          table, tr, td, th {
            background-color: white !important;
            color: black !important;
            border-color: black !important;
            font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif !important;
          }
          
          th {
            background-color: #f3f4f6 !important;
            color: black !important;
            font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif !important;
            font-weight: 500 !important;
          }
          
          tr:nth-child(even) {
            background-color: #f9fafb !important;
          }
          
          tr:hover {
            background-color: #f3f4f6 !important;
          }
          
          /* Override button styles */
          button {
            background-color: white !important;
            color: black !important;
            border-color: black !important;
          }
          
          /* Ensure headings use proper Urdu font */
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif !important;
            font-weight: 500 !important;
            line-height: 1.4 !important;
          }
          
          /* Override any remaining CSS custom properties that might use oklch */
          :root {
            --background: white !important;
            --foreground: black !important;
            --card: white !important;
            --card-foreground: black !important;
            --popover: white !important;
            --popover-foreground: black !important;
            --primary: black !important;
            --primary-foreground: white !important;
            --secondary: #f3f4f6 !important;
            --secondary-foreground: black !important;
            --muted: #f9fafb !important;
            --muted-foreground: black !important;
            --accent: #f3f4f6 !important;
            --accent-foreground: black !important;
            --destructive: #ef4444 !important;
            --destructive-foreground: white !important;
            --border: black !important;
            --input: white !important;
            --ring: black !important;
          }
        `;
        document.head.appendChild(tempStyle);

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: element.scrollWidth,
          height: element.scrollHeight,
          ignoreElements: (element) => {
            return element.hasAttribute('data-export-button') || 
                   element.hasAttribute('data-back-button') ||
                   element.classList.contains('print:hidden');
          }
        });

        // Remove temporary style and restore buttons
        document.head.removeChild(tempStyle);
        buttons.forEach(btn => {
          (btn as HTMLElement).style.display = '';
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Generate filename
        const uniqueCode = generateUniqueCode();
        const customerName = (accountDetails.name || 'Customer').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Customer';
        const filename = `${customerName}_Ledger_${uniqueCode}.pdf`;
        
        pdf.save(filename);
        console.log('Urdu PDF saved successfully');
        
      } else {
        // For English, check if there's any Urdu text in the data
        const hasUrduText = (text: string) => {
          const urduRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
          return urduRegex.test(text);
        };
        
        const containsUrduContent = 
          hasUrduText(accountDetails?.name || '') ||
          transactions.some(txn => 
            hasUrduText(txn.description) || 
            hasUrduText(String(txn.qty || '')) ||
            hasUrduText(String(txn.price || ''))
          );

        if (containsUrduContent) {
          // Use html2canvas for mixed content to preserve Urdu fonts
          const element = contentRef.current;
          if (!element) {
            console.error('Content element not found');
            return;
          }

          // Hide buttons during capture
          const buttons = element.querySelectorAll('[data-export-button], [data-back-button]');
          buttons.forEach(btn => {
            (btn as HTMLElement).style.display = 'none';
          });

          // Create a temporary style element for English layout with Urdu font support
          const tempStyle = document.createElement('style');
          tempStyle.innerHTML = `
            * {
              background-color: white !important;
              color: black !important;
              border-color: black !important;
              outline-color: black !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            
            /* Use system fonts for English but ensure Urdu fallback */
            * {
              font-family: 'Helvetica', 'Arial', 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', sans-serif !important;
              line-height: 1.6 !important;
            }
            
            table, tr, td, th {
              background-color: white !important;
              color: black !important;
              border-color: black !important;
              line-height: 1.8 !important;
              padding: 8px !important;
            }
            
            th {
              background-color: #f3f4f6 !important;
              color: black !important;
              font-weight: bold !important;
              line-height: 1.8 !important;
              padding: 10px 8px !important;
            }
            
            td {
              line-height: 1.8 !important;
              padding: 8px !important;
              min-height: 40px !important;
            }
            
            tr:nth-child(even) {
              background-color: #f9fafb !important;
            }
          `;
          document.head.appendChild(tempStyle);

          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: element.scrollWidth,
            height: element.scrollHeight,
            ignoreElements: (element) => {
              return element.hasAttribute('data-export-button') || 
                     element.hasAttribute('data-back-button') ||
                     element.classList.contains('print:hidden');
            }
          });

          // Remove temporary style and restore buttons
          document.head.removeChild(tempStyle);
          buttons.forEach(btn => {
            (btn as HTMLElement).style.display = '';
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 0;

          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          
          // Generate filename
          const uniqueCode = generateUniqueCode();
          const customerName = (accountDetails.name || 'Customer').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Customer';
          const filename = `${customerName}_Ledger_${uniqueCode}.pdf`;
          
          pdf.save(filename);
          console.log('English PDF with Urdu content saved successfully');
          
        } else {
          // Pure English content - use autoTable for better performance
          const pdf = new jsPDF('p', 'mm', 'a4');
        
          // Add title and header information
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          const dateRangeText = `${t('accountLedgerDetail.dateRange')}: ${new Date(startDate!).toLocaleDateString("en-GB")} - ${new Date(endDate!).toLocaleDateString("en-GB")}`;
          pdf.text(dateRangeText, 105, 20, { align: 'center' });
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'normal');
          
          const accountName = accountDetails?.name || '';
          const accountLedgerLabel = t('accountLedgerDetail.accountLedger');
          const previousBalanceLabel = t('accountLedgerDetail.previousBalance');
          
          pdf.text(`${accountLedgerLabel}: ${accountName}`, 20, 35);
          pdf.text(`${previousBalanceLabel}: ${previousBalance}`, 20, 45);
          
          // Prepare table data
          const tableHeaders = [
            t('accountLedgerDetail.date'),
            t('accountLedgerDetail.description'),
            t('transactions.transactionId'),
            t('accountLedgerDetail.qty'),
            t('accountLedgerDetail.price'),
            t('accountLedgerDetail.debit'),
            t('accountLedgerDetail.credit'),
            t('accountLedgerDetail.balance')
          ];
          
          let runningBalance = previousBalance;
          const tableData = transactions.map((txn) => {
            runningBalance += txn.debit - txn.credit;
            return [
              new Date(txn.transactionDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              }),
              txn.description,
              txn.transactionId || '',
              txn?.qty || '',
              txn?.price || '',
              txn.debit.toString(),
              txn.credit.toString(),
              runningBalance.toString()
            ];
          });
          
          // Add totals row
          const totalQty = transactions.reduce((acc, txn) => acc + (txn.qty || 0), 0);
          const totalDebit = transactions.reduce((acc, txn) => acc + txn.debit, 0);
          const totalCredit = transactions.reduce((acc, txn) => acc + txn.credit, 0);
          const finalBalance = previousBalance + transactions.reduce((acc, txn) => acc + txn.debit - txn.credit, 0);
          
          const grandTotalText = `${t('accountLedgerDetail.grandTotal')}:`;
          
          tableData.push([
            '',
            grandTotalText,
            '',
            totalQty.toString(),
            '',
            totalDebit.toString(),
            totalCredit.toString(),
            finalBalance.toString()
          ]);
          
          // Generate table using autoTable
          autoTable(pdf, {
            head: [tableHeaders],
            body: tableData,
            startY: 55,
            theme: 'grid',
            styles: {
              fontSize: 10,
              cellPadding: 4,
              lineColor: [0, 0, 0],
              lineWidth: 0.1,
              font: 'helvetica',
              halign: 'left'
            },
            headStyles: {
              fillColor: [243, 244, 246],
              textColor: [0, 0, 0],
              fontStyle: 'bold',
              font: 'helvetica',
              halign: 'left'
            },
            bodyStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              font: 'helvetica',
              halign: 'left'
            },
            alternateRowStyles: {
              fillColor: [249, 250, 251]
            },
            didParseCell: function(data: any) {
              if (data.row.index === tableData.length - 1) {
                data.cell.styles.fillColor = [229, 231, 235];
                data.cell.styles.fontStyle = 'bold';
              }
            },
            columnStyles: {
              0: { cellWidth: 25, halign: 'center' },
              1: { cellWidth: 30, halign: 'left' },
              2: { cellWidth: 20, halign: 'center' },
              3: { cellWidth: 15, halign: 'center' },
              4: { cellWidth: 20, halign: 'center' },
              5: { cellWidth: 20, halign: 'center' },
              6: { cellWidth: 20, halign: 'center' },
              7: { cellWidth: 20, halign: 'center' }
            }
          });

          // Generate filename
          const uniqueCode = generateUniqueCode();
          const customerName = (accountDetails.name || 'Customer').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Customer';
          const filename = `${customerName}_Ledger_${uniqueCode}.pdf`;

          pdf.save(filename);
          console.log('English PDF saved successfully');
        }
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  let balance = previousBalance;
  let totalDebit = 0;
  let totalCredit = 0;
  let totalQty = 0;

  return (
    <TransactionsProvider>
      {loading ? (
        <div className="w-full h-[70vh] flex items-center justify-center">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <div className={`${isUrdu ? 'rtl' : 'ltr'} px-4`}>
          {/* Export and Back Buttons (hidden in PDF) */}
          <div className="flex items-center justify-between mb-2 print:hidden">
            <div className="flex gap-2">
              <Button
                data-export-button
                onClick={exportToPDF}
                disabled={isExporting}
                className={`bg-gray-900 hover:bg-gray-700 text-white ${isUrdu ? 'urdu-font' : ''}`}
              >
                <Download className="w-4 h-4 mr-1" />
                {isExporting ? t('accountLedgerDetail.exporting') : t('accountLedgerDetail.exportPDF')}
              </Button>
              <Button
                data-back-button
                onClick={() => navigate({ to: '/account-ledger' })}
                className={`bg-gray-200 hover:bg-gray-300 text-black ${isUrdu ? 'urdu-font' : ''}`}
              >
                {t('accountLedgerDetail.back')}
              </Button>
            </div>
            <TransactionPrimaryButtons />
          </div>
          {/* PDF Content */}
          <div ref={contentRef} id="pdf-content" className="bg-white text-black">
            {/* Date Range Display */}
            <div className={`text-center mb-4 ${urduFontStyle}`}>
              <h3 className={`text-lg font-semibold ${isUrdu ? 'urdu-font' : ''}`}>
                {t('accountLedgerDetail.dateRange')}: {new Date(startDate!).toLocaleDateString("en-GB")} - {new Date(endDate!).toLocaleDateString("en-GB")}
              </h3>
            </div>
            <div className={`flex justify-between items-center px-2`}>
              {
                !isUrdu && (
                  <h2 className={`text-xl font-bold my-4 ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.accountLedger')}: {accountDetails?.name}
                  </h2>
                )
              }
              <h2 className={`text-xl font-bold my-4 ${isUrdu ? 'urdu-font' : ''}`}>
                {t('accountLedgerDetail.previousBalance')}: {previousBalance}
              </h2>
              {
                isUrdu && (
                  <h2 className={`text-xl font-bold my-4 ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.accountLedger')}: {accountDetails?.name}
                  </h2>
                )
              }
            </div>
            <table className="w-full border-collapse border border-gray-300 cursor-pointer">
              <thead>
                <tr>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.date')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.description')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('transactions.transactionId')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.qty')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.price')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.debit')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.credit')}
                  </th>
                  <th className={`px-2 py-1 ${isUrdu ? 'text-right h-11' : 'text-left'} border border-black ${isUrdu ? 'urdu-font' : ''}`}>
                    {t('accountLedgerDetail.balance')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => {
                  balance += txn.debit - txn.credit;
                  totalDebit += txn.debit;
                  totalCredit += txn.credit;
                  totalQty += txn.qty ? txn.qty : 0
                  return (
                    <tr className="hover:bg-gray-100 hover:dark:bg-gray-700" key={idx}>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>
                        {new Date(txn.transactionDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{txn.description}</td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{txn.transactionId}</td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{txn?.qty}</td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{txn?.price}</td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{txn.debit}</td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{txn.credit}</td>
                      <td className={`px-2 border border-black ${isUrdu ? 'urdu-font h-11' : ''}`}>{balance}</td>
                    </tr>
                  );
                })}
                <tr className="hover:bg-gray-100 dark:bg-gray-700">
                  <td className={`px-2 border border-black font-bold ${isUrdu ? 'text-left h-11 urdu-font' : 'text-right'}`} colSpan={3}>
                    {t('accountLedgerDetail.grandTotal')}:
                  </td>
                  <td className={`px-2 border border-black font-bold ${isUrdu ? 'urdu-font h-11' : ''}`}>{totalQty}</td>
                  <td className={`px-2 border border-black font-bold ${isUrdu ? 'urdu-font h-11' : ''}`}></td>
                  <td className={`px-2 border border-black font-bold ${isUrdu ? 'urdu-font h-11' : ''}`}>{totalDebit}</td>
                  <td className={`px-2 border border-black font-bold ${isUrdu ? 'urdu-font h-11' : ''}`}>{totalCredit}</td>
                  <td className={`px-2 border border-black font-bold ${isUrdu ? 'urdu-font h-11' : ''}`}>{balance}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <TransactionsDialogs setFetch={setFetch} />
    </TransactionsProvider>
  );
};

export default AccountLedgerDetail;