import { Button } from "@material-ui/core";
import { FC, useContext } from "react";
import PageCommands from "../../../../components/page-commands";
import { useGlobal, useRequest } from "../../../../lib/hooks";
import { Delivery, Warehouse } from "../../../../lib/models-inventory";
import { NotificationContext } from "../../../../lib/notifications";
import PageStateContext, {
	PageModeType,
} from "../../../../lib/pageStateContext";
import Form from "./form";

interface IProps {
	parent: Warehouse;
}

const Create: FC<IProps> = ({ parent }) => {
	const ps = useContext(PageStateContext);

	const g = useGlobal();
	const req = useRequest();
	const nc = useContext(NotificationContext);

	const handleSubmit = async (data: Delivery) => {
		nc.processing.show();
		let res = await req.post(`${g.API_URL}/inventory/delivery/save`, data);
		if (res.success) {
			nc.snackbar.show("Record was successfully saved");
			backToList();
		}
		nc.processing.hide();
	};

	const backToList = () => {
		(
			ps.Get("deliveries-setPageMode")?.dispatch as React.Dispatch<
				React.SetStateAction<PageModeType>
			>
		)("list");
	};

	const submitForm = () => {
		(
			ps.Get("create-delivery-form-setExecSubmit")?.dispatch as React.Dispatch<
				React.SetStateAction<Date | null>
			>
		)(new Date());
	};

	const newData = new Delivery();
	newData.warehouseId = parent.id;

	return (
		<>
			<h4>Create Delivery</h4>
			<Form onSubmit={handleSubmit} data={newData} />
			<PageCommands>
				<Button variant="contained" color="default" onClick={backToList}>
					Cancel
				</Button>
				<Button variant="contained" color="primary" onClick={submitForm}>
					Save
				</Button>
			</PageCommands>
		</>
	);
};

export default Create;