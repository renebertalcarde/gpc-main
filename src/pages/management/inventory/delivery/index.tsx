import { FC, useContext, useState } from "react";
import BasePage from "../../../base-page";
import PageHeader from "../../../base-page/page-header";
import PageStateContext, {
	PageModeType,
} from "../../../../lib/pageStateContext";
import List from "./list";
import Create from "./create";
import Edit from "./edit";
import View from "./view";
import Landing from "../landing-page";
import { WarehouseSelect } from "../../../../components/data-select/warehouse-select";
import { Warehouse } from "../../../../lib/models-inventory";
import Items, { IItemProps } from "./items";

const Deliveries: FC = () => {
	const [pageMode, setPageMode] = useState<PageModeType>("list");
	const [openProps, setOpenProps] = useState<object>({});

	const ps = useContext(PageStateContext);
	ps.Add({ key: "deliveries-setPageMode", dispatch: setPageMode });
	ps.Add({ key: "deliveries-setOpenProps", dispatch: setOpenProps });

	const warehouseCookie = sessionStorage.getItem(
		"delivery-warehouse-selection"
	);
	const [warehouse, setWarehouse] = useState<Warehouse | null>(
		warehouseCookie ? JSON.parse(warehouseCookie) : null
	);

	const handleWarehouseSelect = (value: Warehouse | undefined) => {
		if (value) {
			setWarehouse(value);
			sessionStorage.setItem(
				"delivery-warehouse-selection",
				JSON.stringify(value)
			);
		} else {
			setWarehouse(null);
			sessionStorage.removeItem("delivery-warehouse-selection");
		}
		setPageMode("list");
	};

	return (
		<>
			<Landing />

			<WarehouseSelect
				value={warehouse ?? undefined}
				onChange={handleWarehouseSelect}
			/>
			<br />
			{warehouse ? (
				<>
					{pageMode == "list" && (
						<List refresh={new Date()} warehouseId={warehouse.id} />
					)}
					{pageMode == "create" && <Create parent={warehouse} />}
					{pageMode == "edit" && <Edit {...openProps} />}
					{pageMode == "view" && <View {...openProps} />}
					{pageMode == "view-items" && <Items {...(openProps as IItemProps)} />}
				</>
			) : (
				<>[Please select a warehouse to work on]</>
			)}
		</>
	);
};

export default Deliveries;
