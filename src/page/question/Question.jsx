import { Alert, Box, Dialog, DialogTitle,Tab,Tabs,TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EnhancedTable from "../../utils/Table";
import strings from "../../lib/localization";
import { useLocalization } from "../../context/LocalizationContext";
import { GetMethod, PostMethod } from "../../lib/api_method/method";
import { Endpoint } from "../../lib/api/api";
import $ from 'jquery';

export default function Question(props){
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

    const [questionID, setQuestionID] = useState(0);
    const [questionCN, setquestionCN] = useState('');
    const [questionEN, setquestionEN] = useState("");
    const [answersCN, setanswersCN] = useState('');
    const [answersEN, setanswersEN] = useState('');
    
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

    useEffect(() => {
      setLoading(true)
      GetMethod(
        Endpoint.common_question
      )
      .then(response => {
        setData(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
    }, []);

    const handleOpenDialog = () => {
      setOpen(true);
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
      getQuestionDetails(id);
    }

    const submitQuestion = (e) => {
      e.preventDefault();

      if(questionCN != '' &&
        answersCN != '' &&
        questionEN != '' &&
        answersEN != ''
      ){
        PostMethod(
          Endpoint.add_question,
          {
            en:{
              questionEN: questionEN,
              answersEN: answersEN,
            },
            zh:{
              questionCN: questionCN,
              answersCN: answersCN,
            }
          }
        ).then(response=>{
          if(response.success){
            setApiResponse(response)
            setOpen(false);
            setquestionCN('');
            setquestionEN('');
            setanswersCN('');
            setanswersEN('');
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

    const getQuestionDetails = (id) => {

      GetMethod(
        Endpoint.get_question,
        {question_id: id}
      ).then(response => {
        if(response.success){
          let en = response.data.en;
          let zh = response.data.zh;

          setquestionEN(en.title);
          setanswersEN(en.answers);
          setquestionCN(zh.title);
          setanswersCN(zh.answers);
          setQuestionID(en.question_id);
        }
      });
    }
    
    const editQuestion = (e) => {
      e.preventDefault();

      if(questionCN != '' &&
        answersCN != '' &&
        questionEN != '' &&
        answersEN != ''
      ){
        PostMethod(
          Endpoint.edit_question,
          {
            questionID: questionID,
            en:{
              question: questionEN,
              answers: answersEN,
            },
            zh:{
              question: questionCN,
              answers: answersCN,
            }
          }
        ).then(response=>{
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
                  title={strings.common_question}
                  handleEdit={(id) => openEditDialog(id)}
                  handleShow={(show,id) => handleShow(show,id)}
                  handleDelete={(selected) => handleDelete(selected)}
                />
            }
            </div>
            <Dialog open={open} onClose={handleCloseDialog} keepMounted={true}>
              <div className="mx-3.5 p-4">
                <DialogTitle>{strings.add_common_question}</DialogTitle>
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
                      id={`simple-tabpanel-${0}`}
                      aria-labelledby={`simple-tab-${0}`}
                    >
                      <label htmlFor="question">{strings.question}</label>
                      <textarea 
                        id='questionEN'
                        cols="10"
                        rows="5"
                        value={questionEN}
                        onChange={(e) => setquestionEN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.answers}</label>
                      <textarea 
                        id='answerEN' 
                        cols="10" 
                        rows="5"
                        value={answersEN}
                        onChange={(e) => setanswersEN(e.target.value)}
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
                        id='questionCN'
                        cols="10"
                        rows="5"
                        value={questionCN}
                        onChange={(e) => setquestionCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.answers}</label>
                      <textarea 
                        id='answerCN' 
                        cols="10" 
                        rows="5"
                        value={answersCN}
                        onChange={(e) => setanswersCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      ></textarea>
                    </div>
                </Box>
              </div>
              <div className="flex px-10 justify-around mb-4">
                <button 
                  className="px-4 py-2 bg-green-400 rounded-lg cursor-pointer hover:bg-green-300"
                  onClick={submitQuestion}
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
            <Dialog open={openEdit} onClose={handleCloseDialog} keepMounted={true}>
              <div className="mx-3.5 p-4">
                <DialogTitle>{strings.edit_common_question}</DialogTitle>
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
                        id='editQuestionEN'
                        cols="10"
                        rows="5"
                        value={questionEN}
                        onChange={(e) => setquestionEN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.answers}</label>
                      <textarea 
                        id='editAnswerEN' 
                        cols="10" 
                        rows="5"
                        value={answersEN}
                        onChange={(e) => setanswersEN(e.target.value)}
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
                        value={questionCN}
                        onChange={(e) => setquestionCN(e.target.value)}
                        className="border-black border-1 rounded p-1"
                      />

                      <div className="h-7"></div>

                      <label htmlFor="answer">{strings.answers}</label>
                      <textarea 
                        id='editAnswerCN' 
                        cols="10" 
                        rows="5"
                        value={answersCN}
                        onChange={(e) => setanswersCN(e.target.value)}
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