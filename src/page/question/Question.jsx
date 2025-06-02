import { Box, Checkbox, Table, TableCell, TableHead, TableRow, TableSortLabel, TextField } from "@mui/material";
import { useRef, useState } from "react";
import EnhancedTable from "../../utils/Table";
import strings from "../../lib/localization";
import { useLocalization } from "../../context/LocalizationContext";

export default function Question(props){
    const [title,setTitle] = useState('');
    const { strings, changeLanguage } = useLocalization();
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const headCells = [
        {
          id: 'question',
          numeric: false,
          disablePadding: true,
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
          disablePadding: false,
          label: strings.created_at,
        },
        {
          id: 'updated_at',
          numeric: true,
          disablePadding: false,
          label: strings.updated_at,
        },
        {
          id: 'protein',
          numeric: true,
          disablePadding: false,
          label: strings.is_show,
        },
      ];

    return(
        <div className="w-full flex flex-col">
            <div className="flex justify-end px-2 mt-3">
                <button className="bg-green-400 px-3 py-1 rounded-lg hover:bg-green-200 cursor-pointer">
                    {strings.add}
                </button>
                <button 
                  className="bg-red-400 px-3 py-1 rounded-lg hover:bg-green-200 cursor-pointer" 
                  onClick={() => changeLanguage('en')}>
                    change english
                </button>
                <button 
                  className="bg-red-400 px-3 py-1 rounded-lg hover:bg-green-200 cursor-pointer" 
                  onClick={() => changeLanguage('zh')}>
                    change it
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
                <EnhancedTable headCells={headCells}/>
            </div>
        </div>
    )
}