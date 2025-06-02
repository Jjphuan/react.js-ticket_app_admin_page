import { List, styled } from "@mui/material";
import { useState } from "react";
import DashboardDropDown from "./components/dashboard_dropbar";
import { Outlet } from "react-router-dom";

export default function Dashboard(){
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null); 

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

    return (
        <div className="flex h-lvh">
            <div className="w-1/5 bg-black text-white">
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
            <div className="w-full h-full">
                <div className="w-full h-1/10 bg-blue-400">

                </div>
                <Outlet />
            </div>
        </div>
    )
}