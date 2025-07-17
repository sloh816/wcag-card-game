"use client";

import Header from "@/components/Header";
// import ServerConnection from "@/components/ServerConnection";
import { webAudit } from "@/lib/directus";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import DirectusIcon from "@/components/svgs/Directus";

const Page = ({}) => {
	const [reports, setReports] = useState([]);
	const [currentReport, setCurrentReport] = useState(null);
	const [currentPart, setCurrentPart] = useState(null);
	const router = useRouter();
	const id = useSearchParams().get("id");
	const part = useSearchParams().get("part");

	const parts = ["Overview", "Webpages", "Issues", "Generate Report"];

	const fetchReports = async () => {
		try {
			const fetchedReports = await webAudit.getReports();
			setReports(fetchedReports);
		} catch (error) {
			console.error("Error fetching reports:", error);
		}
	};

	const fetchReport = async (id) => {
		try {
			const report = await webAudit.getReportById(id);
			setCurrentReport(report);
		} catch (error) {
			console.error("Error fetching report:", error);
		}
	};

	const fetchWebpages = async (reportId) => {
		try {
			const webpages = await webAudit.getWebpagesByReportId(reportId);
			setCurrentReport((prevReport) => ({
				...prevReport,
				webpages: webpages
			}));
		} catch (error) {
			console.error("Error fetching webpages:", error);
		}
	};

	const updateQuery = (newQueryValue, key) => {
		if (key === "id") {
			router.push(`/web-audit-reports?id=${newQueryValue}`, undefined, { shallow: true });
			setCurrentReport(newQueryValue);
		} else if (key === "part") {
			const queryString = `/web-audit-reports?id=${currentReport.id}&part=${newQueryValue}`;
			router.push(queryString, undefined, {
				shallow: true
			});
			setCurrentPart(newQueryValue);
		}
	};

	useEffect(() => {
		if (id) {
			fetchReport(id);
			fetchWebpages(id);

			if (part) {
				setCurrentPart(part);
			}
		} else {
			fetchReports();
			setCurrentReport(null);
		}
	}, [id]);

	// local components
	const ReportListItem = ({ report }) => {
		return (
			<button
				onClick={() => updateQuery(report.id, "id")}
				className="flex items-center gap-8 w-full border border-navy-40 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:border-grapefruit-100"
			>
				<strong>
					{report.project_no} - {report.client}
				</strong>
				<span className="text-xs font-mono text-charcoal-100">ID: {report.id}</span>
			</button>
		);
	};

	const PartButton = ({ part }) => {
		return currentPart !== part ? (
			<button
				className="px-4 py-2 rounded-lg block w-full text-left underline-offset-4 decoration-2 decoration-grapefruit-100 hover:underline hover:font-bold hover:text-navy-100"
				onClick={() => updateQuery(part, "part")}
			>
				{part}
			</button>
		) : (
			<span className="px-4 py-2 rounded-lg block w-full text-left font-bold bg-teal-20">
				{part}
			</span>
		);
	};

	const SectionsList = () => {
		return (
			<div className="w-60 shrink-0 h-screen border-r border-charcoal shadow-lg fixed left-0">
				<div className="px-4 py-6">
					<h2 className="font-bold text-lg mb-4">Sections</h2>
					<ul className="flex flex-col gap-2">
						{parts.map((part) => {
							return <PartButton key={part} part={part} />;
						})}
					</ul>
				</div>
			</div>
		);
	};

	const ReportNameAndId = () => {
		return (
			<div className="py-4 px-6 border-b border-charcoal shadow-md fixed top-[80px] w-full bg-white">
				<span>
					<strong>Report:</strong> {currentReport.project_no} - {currentReport.client}
				</span>
				<span className="ml-12 text-xs font-mono text-charcoal-100">
					ID: {currentReport.id}
				</span>
			</div>
		);
	};

	const OverviewSection = () => {
		const details = [
			{ label: "Client", value: currentReport.client },
			{ label: "Project No", value: currentReport.project_no },
			{ label: "Standard", value: currentReport.standard },
			{ label: "Evaluator(s)", value: currentReport.evaluators },
			{ label: "Screen reader tester(s)", value: currentReport.screen_reader_testers }
		];

		for (const index in currentReport.dates) {
			const date = currentReport.dates[index];
			if (date) {
				details.push({
					label: `Submission date ${parseInt(index) + 1}`,
					value: formatDate(date.date)
				});
			}
		}

		const info = [
			{ heading: "Executive summary", content: currentReport.executive_summary },
			{ heading: "Methodology", content: currentReport.methodology },
			{ heading: "Objective", content: currentReport.objective }
		];

		return (
			<>
				<a
					href={currentReport.directusLink}
					className="button button--grapefruit"
					target="_blank"
				>
					<DirectusIcon size={24} fill="white" />
					Edit overview
				</a>

				<div className="mt-12">
					<h2 className="heading-2 mb-6">Report details</h2>
					{details.map((detail) => (
						<p
							key={detail.label}
							className="flex items-center border-b-2 border-charcoal-20 mb-5"
						>
							<strong className="w-60">{detail.label}: </strong>
							<span>{detail.value}</span>
						</p>
					))}
				</div>

				<div className="mt-16">
					{info.map((section) => {
						return (
							<div key={section.heading} className="mt-8 item-content">
								<h2>{section.heading}</h2>
								<div
									dangerouslySetInnerHTML={{
										__html: section.content
									}}
									className="mt-2"
								/>
							</div>
						);
					})}
				</div>
			</>
		);
	};

	const WebpagesSection = () => {
		console.log(currentReport.webpages);
		return (
			<>
				<p>This is a list of webpages that were audited.</p>
				<p className="my-10">[URL and Page title inputs here. Add webpage]</p>
				<ol className="list-decimal ml-8">
					{currentReport.webpages &&
						currentReport.webpages.map((webpage) => {
							console.log(webpage);
							return (
								<li className="my-4 pl-4 group" key={webpage.url}>
									<a href={webpage.url} target="_blank">
										<strong className="group-hover:text-navy-100 group-hover:underline underline-offset-4 decoration-2 decoration-grapefruit-100">
											{webpage.title}
										</strong>
										<br />
										<span className="font-mono text-xs text-charcoal-100">
											{webpage.url}
										</span>
									</a>
								</li>
							);
						})}
				</ol>
			</>
		);
	};

	return (
		<>
			{!currentReport && (
				<div className="max-w-4xl mx-auto px-4 py-20">
					{<h1 className="heading-1 mb-10">Reports</h1>}
					{/* <ServerConnection /> */}

					{
						<div className="grid place-items-center">
							<a href="" className="button button--grapefruit mx-auto">
								Create new report
							</a>
						</div>
					}

					{reports && (
						<ul className="mt-10 flex flex-col gap-4">
							{reports.map((report) => {
								return (
									<li key={report.id}>
										<ReportListItem report={report} />
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}

			{currentReport && (
				<div className="flex flex-row items-start overflow-hidden">
					<SectionsList />
					<div className="py-20 h-screen w-full overflow-y-auto relative ml-60">
						<ReportNameAndId />
						<div className="py-4 px-6 m-6 max-w-4xl">
							{currentPart === "Overview" && <OverviewSection />}
							{currentPart === "Webpages" && <WebpagesSection />}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Page;
