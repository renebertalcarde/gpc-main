import {
	Box,
	Button,
	Checkbox,
	createStyles,
	Divider,
	FormControlLabel,
	Grid,
	makeStyles,
	TextField,
	Theme,
} from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import PageCommands from "../../../../components/page-commands";
import {
	GPCAccount,
	GPCAccountRequest,
	UplineClaim,
} from "../../../../lib/models";
import PageStateContext, {
	PageModeType,
} from "../../../../lib/pageStateContext";
import { useGlobal, useRequest } from "../../../../lib/hooks";
import { NotificationContext } from "../../../../lib/notifications";
import { StyledViewField, StyledViewPage } from "../../../../components/styled";
import { FDate, FDateTime } from "../../../../lib/common";
import { AccountSelect } from "../../../../components/data-select/account-select";
import Loading from "../../../../components/loading";
import UplineClaimView from "../../../my/upline-claim/view";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			"& > div": {
				padding: "10px",
			},
		},
		address: {
			width: "100%",
		},
	})
);

interface IProps {
	dataRequest?: GPCAccountRequest;
}

const View: FC<IProps> = ({ dataRequest }) => {
	const classes = useStyles();

	const g = useGlobal();
	const req = useRequest();
	const nc = useContext(NotificationContext);

	const ps = useContext(PageStateContext);

	const [data, setData] = useState<GPCAccountRequest | undefined>(dataRequest);
	const [uplineAccount, setUplineAccount] = useState<GPCAccount | undefined>();
	const [denyMessage, setDenyMessage] = useState("");
	const [noUpline, setNoUpline] = useState(false);
	const [uplineName, setUplineName] = useState("");
	const [uplineClaim, setUplineClaim] = useState<UplineClaim | undefined>();

	const backToList = () => {
		(
			ps.Get("onlineApplications-account-request-setPageMode")
				?.dispatch as React.Dispatch<React.SetStateAction<PageModeType>>
		)("list");
	};

	const getUplineClaim = async () => {
		const res = await req.get(
			`${process.env.REACT_APP_API}/upline-claim?profileId=${data?.profileId}`
		);

		if (res.success) {
			setUplineClaim(res.data);
		}
	};

	const approve = async () => {
		if (!uplineAccount?.accountNo && !noUpline) {
			nc.snackbar.show("Please select upline", "error");
			return;
		}

		const res = await req.post(
			`${process.env.REACT_APP_API}/gpcaccount-request/approve?id=${data?.id}&staffProfileId=${g.Profile.id}&uplineAccountNo=${uplineAccount?.accountNo}&uplineName=${uplineName}&noUpline=${noUpline}`
		);

		if (res.success) {
			setData(res.data);
			nc.snackbar.show("Request was successfully approved");
		}
	};

	const deny = async () => {
		const confirmed = await nc.confirmbox.show(
			"Are you sure you want to deny this request?"
		);

		if (!confirmed) return;

		const res = await req.post(
			`${process.env.REACT_APP_API}/gpcaccount-request/deny?id=${data?.id}&staffProfileId=${g.Profile.id}&message=${denyMessage}`
		);

		if (res.success) {
			setData(res.data);
			nc.snackbar.show("Request was successfully denied");
		}
	};

	useEffect(() => {
		getUplineClaim();
	}, []);

	return (
		<>
			{data ? (
				<>
					<Grid container className={classes.root}>
						<Grid item sm={6}>
							<h4>View Account Request</h4>
							<StyledViewPage>
								<Grid container spacing={3}>
									<Grid item sm={2}>
										<Box textAlign="right" fontWeight="bold">
											Id:
										</Box>
									</Grid>
									<Grid item sm={10}>
										<StyledViewField>{data.id}</StyledViewField>
									</Grid>
								</Grid>
								<Grid container spacing={3}>
									<Grid item sm={2}>
										<Box textAlign="right" fontWeight="bold">
											Requested by:
										</Box>
									</Grid>
									<Grid item sm={10}>
										<StyledViewField>
											<b>{data.profile.name}</b>
										</StyledViewField>
									</Grid>
								</Grid>
								<Grid container spacing={3}>
									<Grid item sm={2}>
										<Box textAlign="right" fontWeight="bold">
											Date Submitted:
										</Box>
									</Grid>
									<Grid item sm={10}>
										<StyledViewField>
											{FDate(data.dateSubmitted)}
										</StyledViewField>
									</Grid>
								</Grid>
								<Grid container spacing={3}>
									<Grid item sm={2}>
										<Box textAlign="right" fontWeight="bold">
											Status:
										</Box>
									</Grid>
									<Grid item sm={10}>
										<StyledViewField>
											<div>{data.statusDesc}</div>
										</StyledViewField>
									</Grid>
								</Grid>
								{data.isApproved && (
									<Grid container spacing={3}>
										<Grid item sm={2}>
											<Box textAlign="right" fontWeight="bold">
												Upline:
											</Box>
										</Grid>
										<Grid item sm={10}>
											<StyledViewField>
												{data.uplineAccountNo ? (
													<>
														<div>{data.uplineName}</div>
														<small>{data.uplineAccountNo}</small>
													</>
												) : (
													"[No upline]"
												)}
											</StyledViewField>
										</Grid>
									</Grid>
								)}
								{data.isDenied && data.denyMessage && (
									<Grid container spacing={3}>
										<Grid item sm={2}>
											<Box textAlign="right" fontWeight="bold">
												Deny Message:
											</Box>
										</Grid>
										<Grid item sm={10}>
											<StyledViewField>
												<div>{data.denyMessage}</div>
											</StyledViewField>
										</Grid>
									</Grid>
								)}
								<Grid container spacing={3}>
									<Grid item sm={2}>
										<Box textAlign="right" fontWeight="bold">
											By:
										</Box>
									</Grid>
									<Grid item sm={10}>
										<StyledViewField>
											{data.isPending ? (
												"Pending action from management"
											) : (
												<>
													<div>{data.statusBy_Name}</div>
													<small>{FDateTime(new Date(data.statusDate))}</small>
												</>
											)}
										</StyledViewField>
									</Grid>
								</Grid>
								{data.isPending && (
									<>
										<Divider />
										<Grid container spacing={3}>
											<Grid item sm={2}>
												<Box textAlign="right" fontWeight="bold">
													Upline:
												</Box>
											</Grid>
											<Grid item sm={10}>
												<UplineSelect
													uplineAccount={uplineAccount}
													setUplineAccount={setUplineAccount}
													uplineName={uplineName}
													setUplineName={setUplineName}
													noUpline={noUpline}
													setNoUpline={setNoUpline}
												/>
											</Grid>
										</Grid>
										<Divider />
										<Grid container spacing={3}>
											<Grid item sm={2}>
												<Box textAlign="right" fontWeight="bold">
													Deny Message:
												</Box>
											</Grid>
											<Grid item sm={10}>
												<TextField
													multiline
													placeholder="Enter your message here"
													helperText="This message will be saved only when the request is denied"
													className={classes.address}
													value={denyMessage}
													onChange={(e) => setDenyMessage(e.target.value)}
												/>
											</Grid>
										</Grid>
									</>
								)}
							</StyledViewPage>
						</Grid>
						<Grid item sm={6}>
							<UplineClaimView data={uplineClaim} />
						</Grid>
					</Grid>

					<PageCommands>
						<Button variant="contained" color="default" onClick={backToList}>
							Back to list
						</Button>
						{data.isPending && (
							<>
								<Button variant="contained" color="secondary" onClick={deny}>
									Deny
								</Button>
								<Button variant="contained" color="primary" onClick={approve}>
									Approve
								</Button>
							</>
						)}
					</PageCommands>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

export default View;

interface IUplineSelectProps {
	uplineAccount: GPCAccount | undefined;
	setUplineAccount: React.Dispatch<
		React.SetStateAction<GPCAccount | undefined>
	>;
	uplineName: string;
	setUplineName: React.Dispatch<React.SetStateAction<string>>;
	noUpline: boolean;
	setNoUpline: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UplineSelect: FC<IUplineSelectProps> = ({
	uplineAccount,
	setUplineAccount,
	uplineName,
	setUplineName,
	noUpline,
	setNoUpline,
}) => {
	return (
		<>
			<AccountSelect
				inputLabel="Select Upline"
				value={uplineAccount}
				onChange={(value) => {
					if (value) {
						setUplineName(value.profile.name);
						setNoUpline(false);
					} else {
						setUplineName("");
						setNoUpline(true);
					}

					setUplineAccount(value);
				}}
			/>
			<FormControlLabel
				control={
					<Checkbox
						checked={noUpline}
						onChange={(event, checked) => {
							setUplineAccount(undefined);
							setNoUpline(checked);
						}}
						color="primary"
					/>
				}
				label="No upline"
			/>
		</>
	);
};
