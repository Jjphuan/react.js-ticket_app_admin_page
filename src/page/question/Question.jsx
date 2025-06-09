import { Box, Checkbox, Dialog, DialogTitle, Table, TableCell, TableHead, TableRow, TableSortLabel, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EnhancedTable from "../../utils/Table";
import strings from "../../lib/localization";
import { useLocalization } from "../../context/LocalizationContext";
import { GetMethod } from "../../lib/api_method/method";
import { Endpoint } from "../../lib/api/api";

export default function Question(props){
    const [title,setTitle] = useState('');
    const { language,strings, changeLanguage } = useLocalization();
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true)
      GetMethod(Endpoint.common_question)
      .then(response => {
        setData(response);
        setLoading(false);
        console.log(localStorage.getItem('language')) 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
    }, []);
    
    const headCells = [
        {
          id: 'id',
          numeric: false,
          disablePadding: true,
          label: strings.id,
        },
        {
          id: 'question',
          numeric: true,
          disablePadding: false,
          label: strings.question,
        },
        {
          id: 'answers',
          numeric: true,
          disablePadding: false,
          label: strings.answers,
        },
        {
          id: 'created_at',
          numeric: true,
          disablePadding: true,
          label: strings.created_at,
        },
        {
          id: 'updated_at',
          numeric: true,
          disablePadding: true,
          label: strings.updated_at,
        },
        {
          id: 'protein',
          numeric: true,
          disablePadding: true,
          label: strings.is_show,
        },
      ];

      const handleOpenDialog = () => {
        setOpen(true);
      };
    
      const handleCloseDialog = () => {
        setOpen(false);
      };

      function change(lang){
        changeLanguage(lang);
        setLoading(true)
        location.reload();
      }

    return(
        <div className="w-full flex flex-col">
            <div className="flex justify-end px-2 mt-3">
                <button 
                  className="bg-green-400 px-3 py-1 rounded-lg hover:bg-green-200 cursor-pointer"
                  onClick={handleOpenDialog}
                >
                    {strings.add}
                </button>
            </div>
            <div className="flex">
                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { ml: 3, width: '30ch'} }}
                    noValidate
                    autoComplete="off"
                >    
                    <TextField
                        size="small"
                        id="outlined-password-input"
                        label="Title"
                        type="text"
                        onChange={(e)=>setTitle(e.target.value)}
                    />
                </Box>
                <button className="mx-3 bg-blue-400 text-white px-5 rounded-md">
                    {strings.search}
                </button>
            </div>
            <div className="mx-4 mt-5">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading...</p>
              </div>
              ) :
                <EnhancedTable 
                  headCells={headCells}
                  data={data}
                  title={strings.common_question}
                />
            }
            </div>
            <Dialog open={open} onClose={handleCloseDialog}>
              <DialogTitle>Set backup account</DialogTitle>
            </Dialog>
        </div>
    )
}