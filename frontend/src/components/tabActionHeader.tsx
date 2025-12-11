import { Import, Download, RefreshCw } from "lucide-react";

interface TabActionHeaderProps {
    onImport: () => void;
    onExport: () => void;
    onRefresh: () => void;
    total_rows: number  
    total_patient: number
}
const TabActionHeader: React.FC<TabActionHeaderProps> = ({
  total_rows,
  total_patient,
  onImport,
  onExport,
  onRefresh,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        Menampilkan {total_rows}  dari  {total_patient} Pasien
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onImport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Import size={16} className="mr-2" />
          Import
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default TabActionHeader;
