import { FC } from "react";
import { LucideIcon, Plus } from "lucide-react";

type SummaryItem = {
  type?: "add" | "member"; // optional, only for add cards
  label: string;
  buttonText?: string;
  value?: number | string;
  span?: string | number;
  description?:  string;
  icon?: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  onClick?: () => void;
};

type SummaryCardGridProps = {
  items: SummaryItem[];
  columns?: string; // tailwind class, default grid-cols
};

const SummaryCardGrid: FC<SummaryCardGridProps> = ({
  items,
  columns = "lg:grid-cols-4",
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-4 mb-6`}>
      {items.map((item, idx) =>
        item.type === "add" ? (
          <div
            key={idx}
            onClick={item.onClick}
            className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white text-opacity-90">
                  {item.label}
                </p>
                <button className="mt-2 inline-flex items-center px-3 py-1.5 cursor-pointer bg-white rounded-lg text-sm font-medium text-cyan-600 hover:bg-opacity-90 transition-colors">
                  <Plus size={16} className="mr-1" />
                  {item.buttonText}
                </button>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ) : item.type === "member" ? (
            <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {item.value}
                </h3>
                <div className='text-xs'><span className="text-xs font-bold text-green-500 mt-1">{item.span}</span>{item.description}</div>
              </div>
              <div className={`p-3 ${item.bgColor} rounded-lg`}>
                {item.icon && (
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {item.value}
                </h3>
              </div>
              <div className={`p-3 ${item.bgColor} rounded-lg`}>
                {item.icon && (
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SummaryCardGrid;
