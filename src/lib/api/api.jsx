export const domain = 'http://127.0.0.1:8000/api';

export const Endpoint = {

    // question
    common_question: `${domain}/question`,
    add_question: `${domain}/add_question`,
    get_question: `${domain}/get_question`,
    edit_question:  `${domain}/edit_question`,
    edit_show: `${domain}/edit_show`,
    delete_question: `${domain}/delete_question`,

    // discount
    all_discount: `${domain}/discount`,
    add_discount: `${domain}/add_discount`,
    get_discount: `${domain}/get_discount`,
    edit_discount: `${domain}/edit_discount`,

    // ticket
    all_tickets: `${domain}/all_tickets`,
    get_bus: `${domain}/get_bus`,
    get_tickets: `${domain}/get_tickets`,
    add_tickets: `${domain}/add_tickets`,
    edit_tickets: `${domain}/edit_tickets`,
};
