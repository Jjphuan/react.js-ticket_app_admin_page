import { Alert, Box, Dialog, DialogTitle,FormControl,InputLabel,MenuItem,Select,Tab,Tabs,TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EnhancedTable from "../../utils/Table";
import { useLocalization } from "../../context/LocalizationContext";
import { GetMethod, PostMethod } from "../../lib/api_method/method";
import { Endpoint } from "../../lib/api/api";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";

export default function Tickets(props){
    const today = new Date();
    const formattedDateTime = `${today.getFullYear()}-${
      (today.getMonth() + 1).toString().padStart(2, '0')
    }-${today.getDate().toString().padStart(2, '0')} ${today.getHours()}:${today.getMinutes()}`;

    const [title,setTitle] = useState('');
    const { language,strings, changeLanguage } = useLocalization();
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState(false);
    const [dialogError,setDialogError] = useState(false);

    const [busList, setBusList] = useState([]);
    const [now, setNow] = useState(dayjs(formattedDateTime));
    const [date, setDate] = useState(dayjs(''));

    const [ticketID, setTicketID] = useState(0);
    const [departureTime, setDepartureTime] = useState(dayjs(''));
    const [arrivedTime, setArrivedTime] = useState(dayjs(''));
    const [departureFrom, setDepartureFrom] = useState('');
    const [arrivedAt, setArrivedAt] = useState('');
    const [bus, setBus] = useState('');

    
    const headCells = [
      {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: strings.id,
      },
      {
        id: 'created_at',
        numeric: true,
        disablePadding: false,
        label: strings.created_at,
      },
      {
        id: 'time',
        numeric: true,
        disablePadding: false,
        label: strings.time,
      },
      {
        id: 'journey',
        numeric: true,
        disablePadding: true,
        label: strings.journey,
      },
      {
        id: 'bus',
        numeric: true,
        disablePadding: true,
        label: strings.bus,
      }
    ];

    const handleSelectBus = (event) => {
      setBus(event.target.value);
    };

    const handleOpenDialog = () => {
      setOpen(true);
      getAllBus();
    };
  
    const handleCloseDialog = () => {
      setOpen(false);
      setOpenEdit(false);
    };
    
    const openEditDialog = (id) => {
      setOpenEdit(true);
      getTicketDetails(id);
    }


    // call api
    useEffect(() => {
      setLoading(true)
      GetMethod(
        Endpoint.all_tickets
      )
      .then(response => {
        if(response.success){
          setData(response.data);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
    }, []);

    const submitForm = (e) => {
      e.preventDefault();

      if(departureTime != '' && arrivedTime != '' &&
        departureFrom != '' && arrivedAt != '' && bus != ''
      ){
        PostMethod(
          Endpoint.add_tickets,
          {
            departure_time: departureTime,
            arrived_time: arrivedTime,
            departure_from: departureFrom,
            arrived_at: arrivedAt,
            bus: bus
          }
        ).then(response=>{
          if(response.success){
            setOpen(false);
            setDepartureTime('');
            setArrivedTime('');
            setDepartureFrom('');
            setArrivedAt('');
            setBus('');
            setAlert(true);
          }
          setInterval(() => {
            setAlert(false);
            location.reload();
          }, 1000);
          
        }).catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false); 
        });
        
        setDialogError(false);
      }else{
        setDialogError(true);
      }
    }

    const getAllBus = () => {
      GetMethod(
        Endpoint.get_bus,
      ).then(response => {
        if(response.success){
          setBusList(response.data);
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
    }

    const getTicketDetails = (id) => {

      GetMethod(
        Endpoint.get_tickets,
        {
          id: id
        }
      ).then(response => {
        if(response.success){
          let data = response.data;

          setDepartureTime(dayjs(data.departure_time));
          setArrivedTime(dayjs(data.arrived_time));
          setDepartureFrom(data.departure);
          setArrivedAt(data.destination);
          setBus(data.bus_brand);
          setTicketID(id);
        }
      });
    }
    
    const editTicket = (e) => {
      e.preventDefault();

      if(departureTime != '' && arrivedTime != '' &&
        departureFrom != '' && arrivedAt != '' && bus != ''
      ){
        PostMethod(
          Endpoint.edit_tickets,
          {
            id: ticketID,
            departure_time: departureTime,
            arrived_time: arrivedTime,
            departure_from: departureFrom,
            arrived_at: arrivedAt,
            bus: bus
          }
        ).then(response => {

          if(response.success){
            setAlert(true);
            setOpenEdit(false);
            setInterval(() => {
              setAlert(false);
              location.reload();
            }, 1000);
          }
          
        }).catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false); 
        });
        
        setDialogError(false);
      }else{
        setDialogError(true);
      }
    }

    const handleShow = (show,id) => {
      PostMethod(
        Endpoint.edit_show,
        {
          show: show,
          id: id
        }
      ).then(response => {
        if(response.success){
          location.reload();
          setAlert(true);
          setInterval(() => {
            setAlert(false);
          }, 200);
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
      
      setDialogError(false);
    }

    const handleDelete = (selected) => {
      PostMethod(
        Endpoint.delete_question,
        {selected: selected}
      ).then(response => {
        if(response.success){
          location.reload();
          setAlert(true);
          setInterval(() => {
            setAlert(false);
          }, 200);
        }

      }).catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
    }

    return(
        <div className="w-full flex flex-col">
          {alert ? <Alert
           variant="outlined" 
           severity="success"
           sx={{
            position:"absolute",
            right: '33%',
            top: "11%"
          }}
          >
            {strings.success}
          </Alert> : <div></div>}
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
                  title={strings.all_ticket}
                  handleEdit={(id) => openEditDialog(id)}
                  handleShow={(show,id) => handleShow(show,id)}
                  handleDelete={(selected) => handleDelete(selected)}
                />
            }
            </div>
            {/* add dialog */}
            <Dialog open={open} onClose={handleCloseDialog} keepMounted={true}>
              <div className="mx-3.5 p-4 grid-cols-2">
                <DialogTitle>{strings.add_tickets}</DialogTitle>
                {dialogError ? 
                  <Alert
                    variant="filled" 
                    severity="error"
                    sx={{
                    right: '33%',
                    top: "11%",
                    margin: "10px 0"
                  }}
                  >
                    {strings.all_field_required}
                  </Alert> : <div className="h-6"></div>
                  }
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      format="DD/MM/YYYY H:m"
                      minDate={now}
                      label={strings.departure_time} 
                      value={departureTime}
                      onChange={(newDate) => setDepartureTime(newDate)}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      format="DD/MM/YYYY H:m"
                      minDate={departureTime}
                      label={strings.arrived_time} 
                      value={arrivedTime}
                      onChange={(newDate) => setArrivedTime(newDate)}
                      sx={{marginLeft: '3%'}}
                    />
                </LocalizationProvider>
                <TextField
                    id="outlined-basic" 
                    label={strings.departure_from} 
                    variant="outlined" 
                    sx={{width: '45.5%', marginTop: '3%'}}
                    value={departureFrom}
                    onChange={(e) => setDepartureFrom(e.target.value)}
                />
                <TextField
                    id="outlined-basic" 
                    label={strings.destination} 
                    variant="outlined" 
                    sx={{width: '45.5%', marginLeft: '3%', marginTop: '3%'}}
                    value={arrivedAt}
                    onChange={(e) => setArrivedAt(e.target.value)}
                />
                <FormControl variant="outlined" sx={{ width: '45.5%', marginTop: '3%'}}>
                  <InputLabel id="select-bus-brand">{strings.bus}</InputLabel>
                  <Select
                    labelId="select-bus-brand"
                    id="select-bus-brand"
                    value={bus}
                    onChange={handleSelectBus}
                    label="select-bus-brand"
                  >
                    <MenuItem value="None">
                      <em>None</em>
                    </MenuItem>
                    {busList.map((element, index) => (
                      <MenuItem key={index} value={element}>
                        {element}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex px-10 justify-around mb-4">
                <button 
                  className="px-4 py-2 bg-green-400 rounded-lg cursor-pointer hover:bg-green-300"
                  onClick={submitForm}
                >
                  {strings.submit}
                </button>
                <button 
                  className="px-4 py-2 bg-red-400 rounded-lg cursor-pointer hover:bg-red-300"
                  onClick={() => setOpen(false)}
                >
                  {strings.close}
                </button>
              </div>
            </Dialog>
            {/* edit dialog */}
            <Dialog open={openEdit} onClose={handleCloseDialog} keepMounted={true}>
            <div className="mx-3.5 p-4 grid-cols-2">
                <DialogTitle>{strings.edit_tickets}</DialogTitle>
                {dialogError ? 
                  <Alert
                    variant="filled" 
                    severity="error"
                    sx={{
                    right: '33%',
                    top: "11%",
                    margin: "10px 0"
                  }}
                  >
                    {strings.all_field_required}
                  </Alert> : <div className="h-6"></div>
                  }
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      format="DD/MM/YYYY H:m"
                      minDate={now}
                      label={strings.departure_time} 
                      value={departureTime}
                      onChange={(newDate) => setDepartureTime(newDate)}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      format="DD/MM/YYYY H:m"
                      minDate={departureTime}
                      label={strings.arrived_time} 
                      value={arrivedTime}
                      onChange={(newDate) => setArrivedTime(newDate)}
                      sx={{marginLeft: '3%'}}
                    />
                </LocalizationProvider>
                <TextField
                    id="outlined-basic" 
                    label={strings.departure_from} 
                    variant="outlined" 
                    sx={{width: '45.5%', marginTop: '3%'}}
                    value={departureFrom}
                    onChange={(e) => setDepartureFrom(e.target.value)}
                />
                <TextField
                    id="outlined-basic" 
                    label={strings.destination} 
                    variant="outlined" 
                    sx={{width: '45.5%', marginLeft: '3%', marginTop: '3%'}}
                    value={arrivedAt}
                    onChange={(e) => setArrivedAt(e.target.value)}
                />
                <FormControl variant="outlined" sx={{ width: '45.5%', marginTop: '3%'}}>
                  <InputLabel id="select-bus-brand">{strings.bus}</InputLabel>
                  <Select
                    labelId="select-bus-brand"
                    id="select-bus-brand"
                    value={bus}
                    onChange={handleSelectBus}
                    label="select-bus-brand"
                  >
                    <MenuItem value="None">
                      <em>None</em>
                    </MenuItem>
                    {busList.map((element, index) => (
                      <MenuItem key={index} value={element}>
                        {element}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex px-10 justify-around mb-4">
                <button 
                  className="px-4 py-2 bg-green-400 rounded-lg cursor-pointer hover:bg-green-300"
                  onClick={editTicket}
                >
                  {strings.submit}
                </button>
                <button 
                  className="px-4 py-2 bg-red-400 rounded-lg cursor-pointer hover:bg-red-300"
                  onClick={() => setOpenEdit(false)}
                >
                  {strings.close}
                </button>
              </div>
            </Dialog>
        </div>
    )
}