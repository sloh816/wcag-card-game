import DownloadIcon from "@mui/icons-material/Download";

const SuccessMessage = ({ downloadLink, downloadButtonLabel, message }) => {
	return (
		<div className="bg-teal-20 py-2 px-4 rounded-md border border-teal-100 mt-8 flex items-center gap-4">
			{downloadLink && (
				<a className="button button--navy" href={downloadLink} download={true}>
					<DownloadIcon />
					{downloadButtonLabel}
				</a>
			)}
			<p>{message}</p>
		</div>
	);
};

export default SuccessMessage;
