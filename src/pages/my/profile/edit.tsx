import { Button } from "@material-ui/core";
import { FC, useContext } from "react";
import PageCommands from "../../../components/page-commands";
import { useGlobal, useRequest } from "../../../lib/hooks";
import { Profile } from "../../../lib/models";
import { NotificationContext } from "../../../lib/notifications";
import PageStateContext, { PageModeType } from "../../../lib/pageStateContext";
import Form from "./form";

interface IProps {
	data?: Profile;
	caller?: PageModeType;
}

const Edit: FC<IProps> = ({ data, caller }) => {
	const ps = useContext(PageStateContext);

	const g = useGlobal();
	const req = useRequest();
	const nc = useContext(NotificationContext);

	if (!data) return <div>No data provided</div>;

	const handleSubmit = async (data: Profile) => {
		nc.processing.show();
		let res = await req.post(`${g.API_URL}/profile/save`, data);
		if (res.success) {
			nc.snackbar.show("Record was successfully saved");
			backToView(res.data);
		}
		nc.processing.hide();
	};

	const backToView = (data?: Profile) => {
		(
			ps.Get("myprofile-setOpenProps")?.dispatch as React.Dispatch<
				React.SetStateAction<object>
			>
		)({ data: data });

		(
			ps.Get("myprofile-setPageMode")?.dispatch as React.Dispatch<
				React.SetStateAction<PageModeType>
			>
		)("view");
	};

	const submitForm = () => {
		(
			ps.Get("create-myprofile-form-setExecSubmit")?.dispatch as React.Dispatch<
				React.SetStateAction<Date | null>
			>
		)(new Date());
	};

	return (
		<>
			<h4>Update Profile</h4>
			<Form onSubmit={handleSubmit} data={data} />
			<PageCommands>
				<Button
					variant="contained"
					color="default"
					onClick={() => backToView(data)}
				>
					Cancel
				</Button>
				<Button variant="contained" color="primary" onClick={submitForm}>
					Save
				</Button>
			</PageCommands>
		</>
	);
};

export default Edit;