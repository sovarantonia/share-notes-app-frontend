import React, {useState} from 'react';
import "../resources/table.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faPenToSquare, faShare, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import UpdateNoteDialog from "./UpdateNoteDialog";
import DeleteNoteDialog from "./DeleteNoteDialog";
import DownloadDialog from "./DownloadDialog";
import ShareDialog from "./ShareDialog";


const PaginatedTable = ({data, fetchNotes}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get the data for the current page
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Change the page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [open, setOpen] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);

    const handleOpenDialog = (noteId, dialogType) => {
        setSelectedNoteId(noteId);
        setOpen(true);
        setActiveDialog(dialogType);
    };

    const handleCloseDialog = () => {
        setOpen(false); // Close the dialog
        setActiveDialog(null);
    };

    const onUpdate = () => {
        fetchNotes('');
        handleCloseDialog();
    }


    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Grade</th>
                    <th>Date</th>
                    <th>Options</th>
                </tr>
                </thead>
                <tbody>
                {currentData.map(item => (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.text}</td>
                        <td>{item.grade}</td>
                        <td>{item.date}</td>
                        <td>
                            <button type="table-button" title="Edit" id="updateButton"
                                    onClick={() => handleOpenDialog(item.id, "update-dialog")}>
                                <FontAwesomeIcon icon={faPenToSquare} size="xl"/>
                            </button>

                            <button type="table-button" title="Download" id="downloadButton"
                                    onClick={() => handleOpenDialog(item.id, "download-dialog")}>
                                <FontAwesomeIcon icon={faDownload} size="xl"/>
                            </button>

                            <button type="table-button" title="Share note" id="shareButton"
                            onClick={() => handleOpenDialog(item.id, "share-dialog")}>
                                <FontAwesomeIcon icon={faShare} size="xl"/>
                            </button>

                            <button type="table-button" title="Delete" id="deleteButton"
                                    onClick={() => handleOpenDialog(item.id, "delete-dialog")}>
                                <FontAwesomeIcon icon={faTrashCan} size="xl"/>
                            </button>


                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedNoteId !== null && (
                <UpdateNoteDialog
                    open={open && activeDialog === "update-dialog"}
                    onClose={handleCloseDialog}
                    noteId={selectedNoteId}
                    onUpdate={onUpdate}
                />
            )}

            {selectedNoteId !== null && (
                <DeleteNoteDialog
                    open={open && activeDialog === "delete-dialog"}
                    onClose={handleCloseDialog}
                    noteId={selectedNoteId}
                    onUpdate={onUpdate}
                />
            )}

            {selectedNoteId !== null && (
                <DownloadDialog
                    open={open && activeDialog === "download-dialog"}
                    onClose={handleCloseDialog}
                    noteId={selectedNoteId}
                />
            )}

            {selectedNoteId !== null && (
                <ShareDialog
                    open={open && activeDialog === "share-dialog"}
                    onClose={handleCloseDialog}
                    noteId={selectedNoteId}
                />
            )}

            <div className="pagination">
                <button id="previousPageButton"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button id="nextPageButton"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>


        </div>
    );
};

export default PaginatedTable;