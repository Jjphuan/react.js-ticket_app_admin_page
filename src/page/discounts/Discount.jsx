import { Alert, Box, Dialog, DialogTitle,Tab,Tabs,TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EnhancedTable from "../../utils/Table";
import { useLocalization } from "../../context/LocalizationContext";
import { GetMethod, PostMethod } from "../../lib/api_method/method";
import { Endpoint } from "../../lib/api/api";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";

export default function Discount(props){
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
    const [value, setValue] = useState(0);
    const [apiResponse,setApiResponse] = useState('');
    const [dialogError,setDialogError] = useState(false);
    const [alert,setAlert] = useState(false);
    const [now, setNow] = useState(dayjs(''));
    const [date, setDate] = useState(dayjs(''));

    const [discountID, setDiscountID] = useState(0);
    const [descCN, setDescCN] = useState('');
    const [descEN, setDescEN] = useState("");
    const [titleCN, setTitleCN] = useState('');
    const [titleEN, setTitleEN] = useState('');

    
    const headCells = [
      {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: strings.id,
      },
      {
        id: 'title',
        numeric: true,
        disablePadding: false,
        label: strings.title,
      },
      {
        id: 'description',
        numeric: true,
        disablePadding: false,
        label: strings.description,
      },
      {
        id: 'created_at',
        numeric: true,
        disablePadding: true,
        label: strings.created_at,
      },
      {
        id: 'expired_at',
        numeric: true,
        disablePadding: true,
        label: strings.expired_at,
      }
    ];

    useEffect(() => {
      setLoading(true)
      GetMethod(
        Endpoint.all_discount
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

    const handleOpenDialog = () => {
      setOpen(true);
      const formattedDateTime = `${today.getFullYear()}-${
        (today.getMonth() + 1).toString().padStart(2, '0')
      }-${today.getDate().toString().padStart(2, '0')} ${today.getHours()}:${today.getMinutes()}`;
      setNow(dayjs(formattedDateTime));
    };
  
    const handleCloseDialog = () => {
      setOpen(false);
      setOpenEdit(false);
    };

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    const openEditDialog = (id) => {
      setOpenEdit(true);
      getDiscountDetails(id);
    }

    const submitForm = (e) => {
      e.preventDefault();

      if(titleEN != '' &&
        descEN != '' &&
        titleCN != '' &&
        descCN != ''
      ){
        PostMethod(
          Endpoint.add_discount,
          {
            expired_at: date.toString(),
            en:{
              title: titleEN,
              description: descEN,
            },
            zh:{
              title: titleCN,
              description: descCN,
            }
          }
        ).then(response=>{
          if(response.success){
            setApiResponse(response)
            setOpen(false);
            setTitleCN('');
            setTitleEN('');
            setDescCN('');
            setDescEN('');
            setValue(0);
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

    const getDiscountDetails = (id) => {

      GetMethod(
        Endpoint.get_discount,
        {
          discount_id: id
        }
      ).then(response => {
        if(response.success){
          let en = response.data.en;
          let zh = response.data.zh;

          setTitleEN(en.name);
          setDescEN(en.description);
          setTitleCN(zh.name);
          setDescCN(zh.description);
          setDate(dayjs(response.data.expired_at));
          setDiscountID(id);
        }
      });
    }
    
    const editQuestion = (e) => {
      e.preventDefault();

      if(descCN != '' &&
        descEN != '' &&
        descCN != '' &&
        descEN != ''
      ){
        PostMethod(
          Endpoint.edit_discount,
          {
            discount_id: discountID,
            en:{
              name: titleEN,
              description: descEN,
            },
            zh:{
              name: titleCN,
              description: descCN,
            }
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
                  title={strings.discount}
                  handleEdit={(id) => openEditDialog(id)}
                  handleShow={(show,id) => handleShow(show,id)}
                  handleDelete={(selected) => handleDelete(selected)}
                />
            }
            </div>
            {/* add dialog */}
            <Dialog open={open} onClose={handleCloseDialog} keepMounted={true}>
              <div className="mx-3.5 p-4">
                <DialogTitle>{strings.add_discount}</DialogTitle>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      format="DD/MM/YYYY H:m"
                      minDate={now}
                      label={strings.expired_at} 
                      value={date}
                      onChange={(newDate) => setDate(newDate)}
                    />
                </LocalizationProvider>
                <Box
                  component="form"
                  sx={{ '& .MuiTextField-root': { width: '25ch' } }}
                  noValidate
                  autoComplete="off"
                >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label={strings.en} />
                      <Tab label={strings.zh} />
                    </Tabs>
                  </Box>
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
                  {/* english */}
                    <div 
                      className="grid grid-cols-1 w-96"
                      hidden={value !== 0}
                      id={`simple-tabpanel-0`}
                      aria-labelledby={`simple-tab-0`}
                    >
                      <label htmlFor="question">{strings.discount}</label>
                      <textarea 
                        id='titleEN'
                        cols="10"
                        rows="5"
                        value={titleEN}
                        onChange={(e) => setTitleEN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.description}</label>
                      <textarea 
                        id='descEN' 
                        cols="10" 
                        rows="5"
                        value={descEN}
                        onChange={(e) => setDescEN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      ></textarea>
                    </div>
                  {/* chinese */}
                  <div 
                      className="grid grid-cols-1 w-96"
                      hidden={value !== 1}
                      id={`simple-tabpanel- `}
                      aria-labelledby={`simple-tab-1`}
                    >
                      <label htmlFor="question">{strings.discount}</label>
                      <textarea 
                        id='questionCN'
                        cols="10"
                        rows="5"
                        value={titleCN}
                        onChange={(e) => setTitleCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.description}</label>
                      <textarea 
                        id='answerCN' 
                        cols="10" 
                        rows="5"
                        value={descCN}
                        onChange={(e) => setDescCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      ></textarea>
                    </div>
                </Box>
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
              <div className="mx-3.5 p-4">
                <DialogTitle>{strings.edit_discount}</DialogTitle>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      format="DD/MM/YYYY H:m"
                      minDate={now}
                      label={strings.expired_at} 
                      value={date}
                      onChange={(newDate) => setDate(newDate)}
                    />
                </LocalizationProvider>
                <Box
                  component="form"
                  sx={{ '& .MuiTextField-root': { width: '25ch' } }}
                  noValidate
                  autoComplete="off"
                >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label={strings.en} />
                      <Tab label={strings.zh} />
                    </Tabs>
                  </Box>
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
                   </Alert> : <div className="h-6"></div>}
                  {/* english */}
                    <div 
                      className="grid grid-cols-1 w-96"
                      hidden={value !== 0}
                      id={`simple-tabpanel-0`}
                      aria-labelledby={`simple-tab-0`}
                    >
                      <label htmlFor="question">{strings.question}</label>
                      <textarea 
                        id='editTitleEN'
                        cols="10"
                        rows="5"
                        value={titleEN}
                        onChange={(e) => setTitleEN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.answers}</label>
                      <textarea 
                        id='editAnswerEN' 
                        cols="10" 
                        rows="5"
                        value={descEN}
                        onChange={(e) => setDescEN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      ></textarea>
                    </div>
                  {/* chinese */}
                  <div 
                      className="grid grid-cols-1 w-96"
                      hidden={value !== 1}
                      id={`simple-tabpanel- `}
                      aria-labelledby={`simple-tab-1`}
                    >
                      <label htmlFor="question">{strings.question}</label>
                      <textarea 
                        id='editQuestionCN'
                        cols="10"
                        rows="5"
                        value={titleCN}
                        onChange={(e) => setTitleCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.answers}</label>
                      <textarea 
                        id='editAnswerCN' 
                        cols="10" 
                        rows="5"
                        value={descCN}
                        onChange={(e) => setDescCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      ></textarea>
                    </div>
                </Box>
              </div>
              <div className="flex px-10 justify-around mb-4">
                <button 
                  className="px-4 py-2 bg-green-400 rounded-lg cursor-pointer hover:bg-green-300"
                  onClick={(e) => editQuestion(e)}
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