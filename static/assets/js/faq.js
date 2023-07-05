$(document).ready(() =>{
    const url = 'http://127.0.0.1:8000/faq-list/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        data.faqs.forEach((faq) => {
            let faqItemDiv = $('#faqItem')
            let faqContent = 
            `
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" id="faqCollapseBtn" data-bs-target="#faq-${faq.faq_id}" type="button" data-bs-toggle="collapse">
                ${faq.question}
                </button>
            </h2>
            <div id="faq-${faq.faq_id}" class="accordion-collapse collapse" data-bs-parent="#faq-group-2">
                <div class="accordion-body">
                ${faq.answer}
                </div>
            </div>
            `
            faqItemDiv.append(faqContent)
        })
    })
})