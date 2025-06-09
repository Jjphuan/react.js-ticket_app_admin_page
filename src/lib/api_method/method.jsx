import $ from 'jquery';

// GET request
export const GetMethod = (api) => {
    const currenLanguage = localStorage.getItem('language') || 'en';
    return $.ajax({
      url: api,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Accept-Language': currenLanguage
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
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Accept-Language': currenLanguage
      }
    });
  };
  