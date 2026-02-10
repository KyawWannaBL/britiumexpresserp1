import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, AlertTriangle, Check, X, Download } from 'lucide-react';
import { useLanguageContext } from "@/lib/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BulkUploadAPI, BulkUploadItem } from "@/lib/admin-api";

const BulkUpload = () => {
  const { t } = useLanguageContext();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [items, setItems] = useState<BulkUploadItem[]>([]);
  const [validationComplete, setValidationComplete] = useState(false);

  // Mock validation results for demo
  const [rows, setRows] = useState([
    { row: 1, receiver: 'Kyaw Kyaw', phone: '0912345678', address: 'Yangon', status: 'valid' },
    { row: 2, receiver: 'Su Su', phone: '0987654321', address: 'Mandalay', status: 'valid' },
    { row: 3, receiver: 'Aung Aung', phone: '123', address: '', status: 'error', msg: 'Invalid Phone & Missing Address' },
  ]);

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('csv') || droppedFile.type.includes('excel'))) {
      await processFile(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setAnalyzing(true);
    setFile(selectedFile);
    
    try {
      // Create bulk upload record
      const upload = await BulkUploadAPI.create({
        filename: selectedFile.name,
        total_rows: rows.length,
        valid_rows: rows.filter(r => r.status === 'valid').length,
        error_rows: rows.filter(r => r.status === 'error').length,
        status: 'processing'
      });
      
      setUploadId(upload.id);
      
      // Simulate file processing
      setTimeout(() => {
        setAnalyzing(false);
        setValidationComplete(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setAnalyzing(false);
    }
  };

  const handleCreateShipments = async () => {
    if (!uploadId) return;
    
    try {
      const validRows = rows.filter(r => r.status === 'valid');
      
      // Create bulk upload items
      const itemsData = validRows.map((row, index) => ({
        upload_id: uploadId,
        row_number: row.row,
        receiver_name: row.receiver,
        receiver_phone: row.phone,
        receiver_address: row.address,
        validation_status: 'valid' as const
      }));
      
      await BulkUploadAPI.createItems(itemsData);
      await BulkUploadAPI.updateStatus(uploadId, 'completed');
      
      alert(`${validRows.length} shipments created successfully!`);
      resetForm();
      
    } catch (error) {
      console.error('Error creating shipments:', error);
      alert('Error creating shipments');
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadId(null);
    setItems([]);
    setValidationComplete(false);
    setAnalyzing(false);
  };

  const downloadTemplate = () => {
    const csvContent = "receiver_name,receiver_phone,receiver_address,sender_name,weight,cod_amount,special_instructions\n" +
                      "John Doe,0912345678,123 Main St Yangon,Company ABC,2.5,50000,Handle with care\n" +
                      "Jane Smith,0987654321,456 Oak Ave Mandalay,Company XYZ,1.2,25000,Fragile item";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("bulk.orderUpload")} / အများအပြား အော်ဒါ အပ်လုဒ်
        </h1>
        <p className="text-gray-600 mt-1">
          Upload CSV or Excel files to create multiple shipments at once
        </p>
      </div>

      {/* Upload Zone */}
      {!file && (
        <Card>
          <CardContent className="p-8">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer group"
            >
              <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {t("bulk.dragDropFile")} / CSV / Excel ဖိုင်ကို ဆွဲ၍ ထည့်ရန်
              </h3>
              <p className="text-gray-500 mb-4">
                {t("bulk.or")} / မဟုတ်တော့
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
                  {t("bulk.browseComputer")} / ကွန်ပျူတာမှ ရွေးရန်
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="mt-4"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("bulk.downloadTemplate")} / တမ်းပလိတ် ဒေါင်းလုဒ်ရန်
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {analyzing && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">{t("bulk.analyzing")} / ဖိုင်ကို စစ်ဆေးနေသည်...</h3>
            <p className="text-gray-600">Please wait while we validate your data...</p>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {file && validationComplete && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("bulk.validationResults")} / စစ်ဆေးမှု ရလဒ်များ</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t("bulk.validErrorFound")} / ၂ မှန်ကန်, ၁ အမှားရှိ
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  {t("bulk.reUpload")} / ပြန်လည်အပ်လုဒ်
                </Button>
                <Button
                  onClick={handleCreateShipments}
                  disabled={rows.filter(r => r.status === 'error').length > 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t("bulk.createShipments")} / ပို့ဆောင်မှုများ ဖန်တီးရန်
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">{t("bulk.row")} / အတန်း</th>
                    <th className="text-left py-3 px-4">{t("bulk.receiver")} / လက်ခံသူ</th>
                    <th className="text-left py-3 px-4">{t("bulk.phone")} / ဖုန်း</th>
                    <th className="text-left py-3 px-4">{t("bulk.address")} / လိပ်စာ</th>
                    <th className="text-left py-3 px-4">{t("admin.status")} / အခြေအနေ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">#{r.row}</td>
                      <td className="py-3 px-4">{r.receiver}</td>
                      <td className="py-3 px-4">{r.phone}</td>
                      <td className="py-3 px-4">{r.address || '-'}</td>
                      <td className="py-3 px-4">
                        {r.status === 'valid' ? (
                          <span className="flex items-center gap-2 text-green-600">
                            <Check className="w-4 h-4" />
                            {t("bulk.valid")} / မှန်ကန်
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="flex items-center gap-2 text-red-600">
                              <X className="w-4 h-4" />
                              {t("bulk.error")} / အမှား
                            </span>
                            {r.msg && (
                              <p className="text-xs text-red-500">{r.msg}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Instructions / အပ်လုဒ် လမ်းညွှန်ချက်များ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <strong>Supported formats:</strong> CSV, Excel (.xlsx, .xls)
                <br />
                <span className="text-gray-600">ပံ့ပိုးသော ဖိုင်အမျိုးအစားများ: CSV, Excel</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <strong>Required columns:</strong> receiver_name, receiver_phone, receiver_address
                <br />
                <span className="text-gray-600">လိုအပ်သော ကော်လံများ: လက်ခံသူအမည်, ဖုန်းနံပါတ်, လိပ်စာ</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <strong>Maximum rows:</strong> 1000 per upload
                <br />
                <span className="text-gray-600">အများဆုံး အတန်းများ: တစ်ကြိမ်လျှင် ၁၀၀၀ တန်း</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUpload;