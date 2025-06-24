import { AiFillDollarCircle } from "react-icons/ai";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { TbClockHour4Filled } from "react-icons/tb";
import { RideByUserResponse } from "@interfaces/ride/RideByUserResponse";

interface RideItemProps {
	data: RideByUserResponse;
	id: string; // ID HTML que se pasará desde el map
}

export default function RideItem({ data, id }: RideItemProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div id={id} className="border rounded-lg p-4 mb-4">
			<div className="flex items-center">
				<FaLocationDot />
				<b className="ml-2">Origen:</b>
				<p id="origin" className="ml-2">{data.originName}</p>
			</div>

			<div className="flex items-center">
				<TbClockHour4Filled />
				<b className="ml-2">Fecha Salida:</b>
				<p id="departure" className="ml-2">{formatDate(data.departureDate)}</p>
			</div>

			<div className="flex items-center">
				<FaMapLocationDot />
				<b className="ml-2">Destino:</b>
				<p id="destination" className="ml-2">{data.destinationName}</p>
			</div>

			<div className="flex items-center">
				<AiFillDollarCircle />
				<b className="ml-2">Precio:</b>
				<p id="price" className="ml-2">{data.price}</p>
			</div>
		</div>
	);
}