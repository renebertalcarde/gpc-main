import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import { FC } from "react";
import HomeIcon from "@material-ui/icons/Home";
import StoreIcon from "@material-ui/icons/Store";
import { Tooltip } from "@material-ui/core";

const mnuData = [
	{
		key: "main",
		label: "Home",
		icon: <HomeIcon />,
	},
	{
		key: "inventory",
		label: "Inventory",
		icon: <StoreIcon />,
	},
];

interface IProps {
	activate: (component: string) => void;
}
const Menu: FC<IProps> = ({ activate }) => {
	return (
		<>
			<List>
				{mnuData.map((x) => (
					<ListItem button key={x.key} onClick={() => activate(x.key)}>
						<ListItemIcon>
							<Tooltip title={x.label}>{x.icon}</Tooltip>
						</ListItemIcon>
						<ListItemText primary={x.label} />
					</ListItem>
				))}
			</List>
			<Divider />
		</>
	);
};

export default Menu;