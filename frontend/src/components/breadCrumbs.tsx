
import { Link } from "react-router"
interface BreadCrumbsProps {
    title: string
    subtitle: string
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ title, subtitle }) => {
    return (
        
        <div className="">
            {subtitle == "" ? (
                <div className="flex">
                <Link to="/" className="text-sm  mb-4 hover:underline">Dashboard / </Link>
                <h1 className="text-sm  mb-4 text-blue-500 font-bold">&nbsp;{title}</h1>
                </div>
            )
            : (
            <div className="flex">
            <Link to="/" className="text-sm hover:underline  mb-4">Dashboard / </Link>
            <Link to={`/${title}`} className="text-sm hover:underline mb-4">&nbsp;{title} / </Link>
            <h1 className="text-sm  mb-4 text-blue-500 font-bold">&nbsp;{subtitle}</h1>
            </div>
            )
            }

        </div>
    )
}

export default BreadCrumbs