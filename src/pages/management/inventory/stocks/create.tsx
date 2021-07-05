import { Button } from "@material-ui/core";
import { FC, useContext } from "react";
import PageCommands from "../../../../components/page-commands";
import { useGlobal, useRequest } from "../../../../lib/hooks";
import { Stock } from "../../../../lib/models-inventory";
import { NotificationContext } from "../../../../lib/notifications";
import PageStateContext, {
	PageModeType,
} from "../../../../lib/pageStateContext";
import Form from "./form";

const Create: FC = () => {
	const ps = useContext(PageStateContext);

	const g = useGlobal();
	const req = useRequest();
	const nc = useContext(NotificationContext);

	const handleSubmit = async (data: Stock) => {
		nc.processing.show();
		let res = await req.post(`${g.API_URL}/inventory/stock/save`, data);
		if (res.success) {
			nc.snackbar.show("Record was successfully saved");
			backToView(res.data);
		}
		nc.processing.hide();
	};

	const backToList = () => {
		(
			ps.Get("stocks-setPageMode")?.dispatch as React.Dispatch<
				React.SetStateAction<PageModeType>
			>
		)("list");
	};

	const backToView = (data: Stock) => {
		(
			ps.Get("stocks-setOpenProps")?.dispatch as React.Dispatch<
				React.SetStateAction<object>
			>
		)({ data: data });
		(
			ps.Get("stocks-setPageMode")?.dispatch as React.Dispatch<
				React.SetStateAction<PageModeType>
			>
		)("view");
	};

	const submitForm = () => {
		(
			ps.Get("create-stock-form-setExecSubmit")?.dispatch as React.Dispatch<
				React.SetStateAction<Date | null>
			>
		)(new Date());
	};

	return (
		<>
			<h4>Create Stock</h4>
			<Form onSubmit={handleSubmit} />
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
