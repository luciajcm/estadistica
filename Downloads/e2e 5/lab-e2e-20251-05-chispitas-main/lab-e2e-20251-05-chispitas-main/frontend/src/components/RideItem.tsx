import { RideByUserResponse } from "@interfaces/ride/RideByUserResponse";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { TbClockHour4Filled } from "react-icons/tb";

interface RideItemProps {
	ride: RideByUserResponse;
	className?: string;
}

export default function RideItem({ ride, className = "" }: RideItemProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<section id={`ride-${ride.id}`} className={`border rounded-lg p-4 mb-4 ${className}`}>
			<div className="flex items-center">
				<FaLocationDot />
				<b className="ml-2">Origen:</b>
				<p id="origin" className="ml-2">
					{ride.originName}
				</p>
			</div>

			<div className="flex items-center">
				<TbClockHour4Filled />
				<b className="ml-2">Fecha Salida:</b>
				<p id="departure" className="ml-2">
					{formatDate(ride.departureDate)}
				</p>
			</div>

			<div className="flex items-center">
				<FaMapLocationDot />
				<b className="ml-2">Destino:</b>
				<p id="destination" className="ml-2">
					{ride.destinationName}
				</p>
			</div>

			<div className="flex items-center">
				<AiFillDollarCircle />
				<b className="ml-2">Precio:</b>
				<p id="price" className="ml-2">
					${ride.price}
				</p>
			</div>
		</section>
	);
}
