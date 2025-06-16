import $ from 'jquery';

// GET request
export const GetMethod = (api,queryParameter = {}) => {
    const currenLanguage = localStorage.getItem('language') || 'en';
    return $.ajax({
      url: api,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Accept-Language': currenLanguage
      },
      data: queryParameter,
      success: function(response) {
        console.log(response);
      }
    });
  };
  
  // POST request
  export const PostMethod = (api, data) => {
    const currenLanguage = localStorage.getItem('language') || 'en';
    return $.ajax({
      url: api,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': currenLanguage
      },
    });
    
  };
  