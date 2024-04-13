import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChartSkeleton() {
     return (
          <div className="placholder-glow align-items-center justify-content-center">
               <FontAwesomeIcon icon={faChartLine} />
          </div>
     );
}