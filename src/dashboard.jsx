import { FormControl, FormHelperText, List, MenuItem, Select, styled } from "@mui/material";
import { useState } from "react";
import DashboardDropDown from "./components/dashboard_dropbar";
import { Outlet } from "react-router-dom";
import { useLocalization } from "./context/LocalizationContext";

export default function Dashboard(){
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null); 
    const { strings, changeLanguage } = useLocalization();
    const [key, setKey] = useState(0);
    const [lang, setLang] = useState(localStorage.getItem('language') || 'en');

    const StyledList = styled(List)(({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: "grey",
        color: theme.palette.common.white,
        padding: 0,
        margin: 0
      }));

      const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com',route: 'user'},
        { id: 2, name: 'Bob', email: 'bob@example.com',route: 'user' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com',route: 'question' },
      ];

      const dropdownItems = [
        {
          title: 'Users',
          subList: [
            { name: 'User List', route: '/user' },
            { name: 'Add User', route: '/user' }
          ]
        },
        {
          title: 'Questions',
          subList: [
            { name: 'Question List', route: '/question' }
          ]
        }
      ];

      function changeLang(lang){
        changeLanguage(lang);
        setKey(prev => prev + 1); 
      }

      const handleChange = (event) => {
        setLang(event.target.value);
        changeLang(event.target.value);
      };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/5 bg-black text-white h-auto">
                <h1 className="w-full flex justify-center mt-4 mb-16">Ticket App Admin Page</h1>
                <StyledList
                    component="nav"
                    >
                    {dropdownItems.map((dropdown, index) => (
                        <DashboardDropDown
                            key={index}
                            index={index}
                            props={{ title: dropdown.title }}
                            subList={dropdown.subList}
                            isOpen={openDropdownIndex === index}
                            setOpenDropdownIndex={setOpenDropdownIndex}
                        />
                        ))}
                </StyledList> 
            </div>
            <div className="w-full flex flex-1 flex-col">
                <div className="w-full h-16 bg-blue-400 flex justify-end items-center">
                  <FormControl 
                    sx={{ m: 2, minWidth: 80,background: "white",borderRadius: "4px"}} 
                    size="small"
                  >
                    <Select
                      value={lang}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{'aria-label': 'Without label' }}
                    >
                      <MenuItem value='en'>{strings.en}</MenuItem>
                      <MenuItem value='zh'>{strings.zh}</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <Outlet key={key}/>
                </div>
            </div>
        </div>
    )
}