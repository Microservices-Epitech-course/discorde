import {NextPage} from "next";

const PrivateMessage: NextPage<{ id: string }> = ({ id }) => <div>PrivateMessage: {id}</div>

export default PrivateMessage;
