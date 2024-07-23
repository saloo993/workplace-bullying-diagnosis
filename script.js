const pages = [
    {
        title: "소개",
        content: `우리나라 근로기준법이 적용되는 괴롭힘 행위는 포괄적으로 범위가 매우 넓습니다. 
        사회통념상 범죄에 준하는 행위부터 일반적인 업무상 소통에 근접한 행위까지 다양합니다.
        범죄에 준하는 행위는 한 번만 겪어도 바로 나 자신을 피해자로 볼 수 있습니다.
        하지만 그 외 행위는 국제적으로도 어느 수준 이상 지속되고 반복되어야 피해자로 인정됩니다.
        2023년에 조사한 근로자 1200명의 집단지성을 바탕으로 만든 본 진단도구(서유정ᆞ김종우 연구)를 통해 
        나 스스로가 괴롭힘 피해자에 해당하지 않는지 판단해 보세요.`
    },
    {
        title: "지난 1개월 동안 직장에서 다음 상황을 몇 번 경험하셨습니까",
        questions: [
            "나에게 신체적인 위협이나 폭력을 가했다 (예: 물건던지기, 주먹질 등)",
            "성적 수치심을 느끼게 하는 말 또는 행동을 피해자에게 했다",
            "나에게 욕설이나 위협적인 말을 했다",
            "나에게 부서이동 또는 퇴사를 강요했다"
        ]
    },
    {
        title: "지난 2개월 동안 직장에서 다음 상황을 몇 번 경험하셨습니까",
        questions: [
            "나의 업무능력이나 성과를 인정하지 않거나 조롱했다",
            "내 성과를 가로채거나, 성과 달성을 방해했다",
            "나에게 휴가나 병가, 각종 복지혜택 등을 쓰지 못하도록 압력을 주었다",
            "일하거나 휴식하는 모습을 지나치게 감시했다 (예: CCTV를 통한 감시)",
            "사고위험이 있는 작업을 할 때, 나에게 주의사항이나 안전장비를 전달해주지 않았다",
            "나에게 상사의 관혼상제나 개인적인 일상생활과 관련된 일을 하도록 했다 (예: 개인 심부름 등)",
            "누군가 내 개인사에 대한 뒷담화나 소문을 퍼뜨렸다",
            "나를 부적절하게 의심하거나, 누명을 씌웠다",
            "누군가 내 물건을 허락 없이 가져가거나 망가뜨렸다",
            "다른 사람들 앞에서(또는 온라인상에서) 나에게 모욕감을 주는 언행을 했다",
            "내 의사와 상관없이 음주/흡연을 강요했다",
            "나의 의사와 관계없이 불필요한 추가근무(야근, 주말출근 등)을 강요했다",
            "나에게 부당한 징계를 주었다 (반성문, 처벌 등)"
        ]
    },
    {
        title: "지난 3개월 동안 직장에서 다음 상황을 몇 번 경험하셨습니까",
        questions: [
            "훈련, 승진, 보상, 일상적인 대우 등에서 차별을 했다",
            "나에게 힘들고, 모두가 꺼리는 업무를 주었다",
            "허드렛일만 시키거나 일을 거의 주지 않았다",
            "업무와 관련된 중요한 정보나 의사결정 과정에서 나를 제외했다",
            "누군가 사소한 일에 트집을 잡거나 시비를 걸었다",
            "내 의사와 관계없이 회식 참여를 강요했다",
            "나를 업무 외의 대화나 친목 모임에서 제외했다",
            "나의 정당한 건의사항이나 의견을 무시했다"
        ]
    }
];

let currentPage = 0;
const answers = [];

function displayPage() {
    const content = document.getElementById('content');
    const page = pages[currentPage];
    
    if (currentPage === pages.length) {
        displayResult();
        return;
    }

    let html = `<h2>${page.title}</h2>`;
    
    if (page.questions) {
        html += page.questions.map((question, index) => `
            <div class="question">
                <label>${question}</label>
                <input type="number" min="0" value="0" id="q${currentPage}_${index}">
                <span>회</span>
            </div>
        `).join('');
    } else {
        html += `<p>${page.content}</p>`;
    }

    content.innerHTML = html;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = currentPage === pages.length - 1 ? '결과 보기' : '다음';
}

function nextPage() {
    if (currentPage > 0 && currentPage < pages.length) {
        const pageAnswers = pages[currentPage].questions.map((_, index) => {
            return parseInt(document.getElementById(`q${currentPage}_${index}`).value) || 0;
        });
        answers.push(pageAnswers);
    }

    currentPage++;
    displayPage();
}

function displayResult() {
    const content = document.getElementById('content');
    const results = calculateResults();

    let html = `
        <h2>진단 결과</h2>
        <p>1개월 내 경험 횟수: ${results[0]}회 (4회 이상이면 Harassment 피해자일 수 있습니다)</p>
        <p>2개월 내 경험 횟수: ${results[1]}회 (8회 이상이면 Bullying 피해자일 수 있습니다)</p>
        <p>3개월 내 경험 횟수: ${results[2]}회 (12회 이상이면 Bullying 피해자일 수 있습니다)</p>
        <p>만약 괴롭힘이 의심된다면, 전문가와 상담하는 것이 좋습니다.</p>
    `;

    content.innerHTML = html;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = '다시 시작';
    nextBtn.onclick = restart;
}

function calculateResults() {
    return answers.map(pageAnswers => pageAnswers.reduce((sum, current) => sum + current, 0));
}

function restart() {
    currentPage = 0;
    answers.length = 0;
    displayPage();
}

displayPage();