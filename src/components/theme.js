import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#4a749f',
        },
        secondary: {
            main: '#4a749f',
        },
        background: {
            default: '#f1f4f9',
            paper: '#ffffffdd',
        },
        text: {
            primary: '#2e2e2e',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#4a749f',
                    fontWeight: 'bold',
                    padding: '12px',
                    border: '1px solid #ddd',
                },
                body: {
                    padding: '12px',
                    border: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#fafafa',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    backgroundColor: '#ffffffdd',
                    padding: '16px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ccc',
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '& .MuiOutlinedInput-root': {
                        padding: '6px',
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                },
                select: {
                    padding: '10px',
                },
                outlined: {
                    borderRadius: 8,
                },
            },
        },
    },

    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#4a749f',
                paddingBottom: 8,
            },
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: {
                fontSize: '1rem',
                color: '#2e2e2e',
            },
        },
    },
    MuiDialogActions: {
        styleOverrides: {
            root: {
                padding: '16px',
                justifyContent: 'flex-end',
                gap: '12px',
            },
        },
    },

});

export default theme;