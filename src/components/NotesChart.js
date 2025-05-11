import React, {useEffect, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import {BarChart} from '@mui/x-charts/BarChart';
import {getNotesBetweenDates} from "./api";
import {endOfWeek, format, startOfWeek} from 'date-fns';
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import html2canvas from "html2canvas";
import Box from "@mui/material/Box";

const formatDate = (date) => {
    return format(date, 'dd-MM-yyyy');
};
const NotesBetweenWeek = () => {
    const [startDate, setStartDate] = useState(startOfWeek(new Date(), {weekStartsOn: 1}));
    const [weeklyGrades, setWeeklyGrades] = useState([]);
    const [error, setError] = useState('');
    const [endDate, setEndDate] = useState(endOfWeek(new Date(), {weekStartsOn: 1}));

    const handleStartDateChange = (date) => {
        setStartDate(startOfWeek(date, {weekStartsOn: 1}));
        setEndDate(endOfWeek(date, {weekStartsOn: 1}))
    };

    const notesBetweenDates = async () => {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        try {
            const response = await getNotesBetweenDates(formattedStartDate, formattedEndDate);
            setWeeklyGrades(response);
        } catch (error) {
            setError("Error retrieving the notes");
        }
    };

    useEffect(() => {
        notesBetweenDates();
    }, [startDate]);

    const chartRef = useRef();

    const handleDownloadChart = async () => {
        if (!chartRef.current) return;

        const canvas = await html2canvas(chartRef.current);
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'chart.png';
        link.click();
    };

    return (
        <div>
            <Typography variant="h4" sx={{mb: 2}}>
                Weekly chart
            </Typography>
            {error && (
                <Typography color="error" id="errorMessage" aria-live="assertive">
                    {error}
                </Typography>
            )}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        '& input': {
                            borderRadius: 2,
                            border: '1px solid #ccc',
                            padding: '10px',
                        },
                    }}
                >
                    <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={handleStartDateChange}
                        dateFormat="dd-MM-yyyy"
                        calendarStartDay={1}
                    />
                </Box>

                <Box
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        '& input': {
                            borderRadius: 2,
                            border: '1px solid #ccc',
                            padding: '10px',
                        },
                    }}
                >
                    <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={handleStartDateChange}
                        dateFormat="dd-MM-yyyy"
                        calendarStartDay={1}
                        readOnly
                    />
                </Box>
            </Box>

            <Box>

                <Box
                    ref={chartRef}
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        '& .MuiBar-root': {
                            strokeWidth: 1,
                            stroke: 'white',
                        },
                    }}
                >
                    {weeklyGrades.length === 0 ? (
                        <Typography>No data to display</Typography>
                    ) : (
                        <>
                            <BarChart
                                height={290}
                                series={[
                                    {
                                        data: weeklyGrades.map((note) => note.averageGrade),
                                    },
                                ]}
                                xAxis={[
                                    {
                                        scaleType: 'band',
                                        data: weeklyGrades.map((note) => note.date),
                                        label: 'Date',
                                    },
                                ]}
                                yAxis={[
                                    {
                                        label: 'Grade',
                                        colorMap: {
                                            type: 'continuous',
                                            min: 1,
                                            max: 10,
                                            color: ['#9a2b20', '#19b141'],
                                        },
                                    },
                                ]}
                            />
                        </>
                    )}
                </Box>
                {weeklyGrades.length > 0 && (<Button
                    onClick={handleDownloadChart}
                    variant="outlined"
                    sx={{display: 'block', mx: 'auto', mt: 2}}
                    id="downloadChartButton"
                >
                    Download Chart
                </Button>)}
            </Box>
        </div>
    );
};

export default NotesBetweenWeek;