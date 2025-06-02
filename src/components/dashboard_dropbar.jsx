import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, styled } from "@mui/material";
import { useState } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from "react-router-dom";

export default function DashboardDropDown({
    props, 
    index,
    subList, 
    routePage,
    isOpen, 
    setOpenDropdownIndex, 
}){

    const handleClick = () => {
        setOpenDropdownIndex(prev => (prev === index ? null : index));
      };
    return(
        <div className="min-w-full">
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={props.title} />
                {isOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            {subList.length > 0 ? (
                <>
                    {subList.map((item, index) => (
                        <Collapse in={isOpen} 
                            timeout="auto" 
                            unmountOnExit 
                            key={index} >
                            <List component="div" disablePadding>
                                <ListItemButton 
                                    component={Link}
                                    to={item.route}
                                    sx={{ 
                                        pl: 4, 
                                        color: 'grey',
                                        background: 'lightgrey',
                                        ":hover":{backgroundColor: 'white',color: 'black'},
                                    }}>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    ))}
                </>
                ) : (
                <p>No data found.</p>
                )}
        </div>
    )
}