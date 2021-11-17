
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";


const override = css`
    display: block;
    margin: 0 auto;
    top: 15rem;
`;

const Spinner = (props) => {
    return (
        <RingLoader color="#36D7B7" loading={props.loading} css={override} size={80} />
    )
};

export default Spinner;