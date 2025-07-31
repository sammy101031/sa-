// DOM要素のキャッシュ
let appContainer, screen1, screen2, screen3, screen4, screen5,
    subjectNameInput, subjectAgeInput, subjectEmailInput, goToScreen2Btn, startExperimentBtn,
    canvasContainer, clusterCanvas, ctx,
    finishPlacementBtn, goToFeedbackBtn, saveFeedbackAndDataBtn, submitAndFinishBtn,
    loadingSpinner, statusMessage, detailsPanel,
    backToScreen1Btn, backToScreen2Btn, backToStartBtn2;

// グローバル変数
let subjectInfo = {};
let experimentData = {
    subjectInfo: {}, positions: [], clusters: [],
    placementTime: null, moveHistory: [], relations: []
};
let currentMode = 'intro';
let foodContainers = {};
let isDrawingCluster = false;
let currentDrawingCluster = null;
let activeDeleteButton = null;
let selectedClusterIndexForDeletion = -1;

// 食品リスト
let foodList = [
    { name: "gyoza", label: "餃子", imgSrc: "https://frozenfoodpress.com/wp-content/uploads/2018/06/4c913c8dc502ecd4682d9b2ce0ee6e9f-e1529890604890.jpeg", info: "油・水なしで、誰が調理しても簡単にパリッパリの羽根ができる、うす皮パリッと、ジューシーで具がギュッと詰まった焼き餃子です。\n誰もが好きな、間違いない安定感のある王道のおいしさです。\n国産のお肉と野菜を使用しています。\n【内容量】12個入り（276g）" },
    { name: "chahan", label: "チャーハン", imgSrc: "https://www.ffa.ajinomoto.com/_var/images/products/97/65cae64b3ce70.png?resize=1200x630", info: "焦がしにんにくのマー油と葱油の香ばしさや、噛むほどに広がる焼豚のうま味で、一度口にすると一心不乱に食べきってしまいたくなるチャーハンです。\n焦がしにんにくの香りを引き立たせ、焼豚の風味も調整し、メリハリのある味を実現。\nどんどん食べ進めたくなる味に進化しました。\n【内容量】580g" },
    { name: "empanada", label: "エンパナーダ", imgSrc: "https://m.media-amazon.com/images/I/51HpEz7bykL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg", info: "アルゼンチン伝統料理：本場の味わいを楽しめるエンパナーダの6個セット。南米の伝統的な味を日本で堪能できます。\n食べ比べセット：シェフが厳選した６種類のエンパナーダを一度に楽しめる贅沢な詰め合わせパック" },
    { name: "gratin", label: "グラタン", imgSrc: "https://static.nichireifoods.co.jp/wp/wp-content/uploads/2021/09/sho_id100.png", info: "蔵王産ミルクを使用。チーズのおいしさとプリプリのえびがマッチしたグラタンです。\nチーズの風味豊かに！チーズを感じられるようカットサイズにもこだわっています。" },
    { name: "ravioli", label: "ラビオリ", imgSrc: "https://greenbeans.com/images-v3/89edeb69-fe10-49ca-baab-5c51900239b9/d8e55ff4-df47-411b-bad7-e6ba56090dcd/1280x1280.webp", info: "爽やかな風味のリコッタチーズとほうれん草をパスタ生地で包みトマトソースで和えたラビオリです。リコッタのマイルドな味わいとトマトソースの相性は抜群、さらにチーズをトッピングし風味豊かに仕上げました。" },
    { name: "australian_meatpie", label: "オーストラリアンミートパイ", imgSrc: "https://storage.aeonshop.com/assets/img/products/3/5904891501521.jpg", info: "チーズ風味が香るミートソースは、100%オージービーフを使用しています。家族や友達、みんなで楽しめる6個入りパックです。\nパイ生地は、フタ部分と下のパイで2種類の異なるパイ生地を使用しています。\n特に上のフタになっているパイはサクサクに仕上げているので、なかのトロっとしたソースとの絶妙なコンビネーションを楽しめます。" },
    { name: "ravioli", label: "ラビオリ", imgSrc: "https://www.eatwell101.com/wp-content/uploads/2022/02/mushroom-ravioli-recipe.jpg", info: "小麦粉を練って作ったパスタ生地の間に、ひき肉や野菜、チーズなどの具材を詰めたイタリア料理。\n様々なソースと組み合わせて楽しまれます。" },
    { name: "yakionigiri", label: "焼きおにぎり", imgSrc: "https://m.media-amazon.com/images/I/71+s1Tix9qL.jpg", info: "香りを立たせ、持続させるニッスイの独自技術「香りのＷアップ製法」で、しょうゆの風味と香りをより引き立たせました。\nたまりしょうゆと二段仕込みしょうゆをブレンドした、まろやかでコクのあるしょうゆの風味豊かな焼きおにぎりです。" },
    { name: "reitou_udon", label: "冷凍うどん", imgSrc: "https://www.tablemark.co.jp/products/frozen/udon/detail/__icsFiles/afieldfile/2016/07/08/7116302.jpg", info: "強いコシと弾力のさぬきうどんに、瀬戸内産いりこを使用しただし香るまろやかでコクのあるつゆ。麺はこだわりの包丁切りで、つゆとの絡みも良くお召し上がりいただけます。" },
    { name: "reitou_pasta", label: "冷凍パスタ", imgSrc: "https://www.nippn.co.jp/products/frozen/ohmy_premium/detail/__icsFiles/afieldfile/2025/02/14/op_bolognese.jpg", info: "牛挽肉の旨みと赤ワインの風味が特長のボロネーゼソース。ゴーダチーズとごろっと大きな揚げなすをトッピング。" },
    { name: "karaage", label: "鶏のから揚げ", imgSrc: "https://www.ffa.ajinomoto.com/_var/images/products/345/65a665121d4b5.png?resize=1200x630", info: "食欲を満たす肉の塊、これぞから揚げの金字塔！\nにんにく風味アップでさらに白飯がガツガツ進む！\n秘伝にんにく油、葱油、特級醤油の極旨仕込みだれにじっくり漬け込んだ香りがクセになるから揚げです。\n火入れの温度にこだわった”秘伝にんにく油”でにんにくの香りが引き立ち、肉汁がジュワッと広がります。" };

function getCurrentTimestamp() {
    if (!experimentData.startTime) return 0;
    return Math.floor((Date.now() - experimentData.startTime) / 1000);
}

function loadFoodListFromLocalStorage() {
    try {
        const storedFoodList = localStorage.getItem('foodList');
        if (storedFoodList) {
            const parsedList = JSON.parse(storedFoodList);
            if (Array.isArray(parsedList) && parsedList.length > 0) {
                foodList = parsedList;
            }
        }
    } catch (e) {
        console.error("[ERROR] loadFoodListFromLocalStorage: Failed to parse from LS.", e);
    }
}

function saveFoodListToLocalStorage() {
    try {
        localStorage.setItem('foodList', JSON.stringify(foodList));
    } catch (e) {
        console.error("[ERROR] saveFoodListToLocalStorage: Failed to save to LS.", e);
    }
}

function showScreen(screenToShow) {
    if (!appContainer || !screenToShow) return;
    [screen1, screen2, screen3, screen4, screen5].forEach(s => {
        if(s) s.classList.remove('active');
    });
    screenToShow.classList.add('active');
    if (!appContainer.classList.contains('active')) {
      appContainer.classList.add('active');
    }
}

function displayFoodDetails(food) {
    const nameEl = document.getElementById('details-food-name');
    const imageEl = document.getElementById('details-food-image');
    const infoEl = document.getElementById('details-food-info');
    const placeholderEl = document.getElementById('details-placeholder');

    if (!detailsPanel || !nameEl || !imageEl || !infoEl || !placeholderEl) return;
    if (currentMode === 'clusterFeedback' && detailsPanel.querySelector('.cluster-feedback-item')) return;
    
    if (!food) {
        nameEl.textContent = '';
        imageEl.src = '';
        imageEl.style.display = 'none';
        infoEl.innerHTML = '';
        placeholderEl.style.display = 'block';
        detailsPanel.scrollTop = 0;
        Object.values(foodContainers).forEach(fc => fc.classList.remove('selected-food-item'));
        return;
    }
    nameEl.textContent = food.label;
    imageEl.src = food.imgSrc;
    imageEl.style.display = 'block';
    infoEl.innerHTML = food.info ? food.info.replace(/\n/g, '<br>') : '情報なし';
    placeholderEl.style.display = 'none';
    detailsPanel.scrollTop = 0;
    Object.values(foodContainers).forEach(fc => fc.classList.remove('selected-food-item'));
    if (foodContainers[food.name]) foodContainers[food.name].classList.add('selected-food-item');
}

function resetScreen3UI() {
    if (canvasContainer) {
        canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove());
    }
    if (ctx && clusterCanvas) {
        ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    }
    foodContainers = {};
    experimentData.clusters = [];
    drawAllClusters();

    if (detailsPanel) {
        detailsPanel.innerHTML = `<h3 id="details-food-name"></h3><img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;"><div id="details-food-info"></div><p id="details-placeholder" class="info-text" style="display:block;">食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。</p>`;
    }
    if (statusMessage) updateStatusMessage("");
    if (finishPlacementBtn) finishPlacementBtn.style.display = 'none';
    if (goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
    if (saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'none';
    if (clusterCanvas) clusterCanvas.classList.remove('active-drawing');
    removeActiveDeleteButton();
    isDrawingCluster = false;
    currentDrawingCluster = null;
}

function initializeApp() {
    console.log("[DEBUG] initializeApp: Starting application initialization.");
    appContainer = document.getElementById('app');
    screen1 = document.getElementById('screen1');
    screen2 = document.getElementById('screen2');
    screen3 = document.getElementById('screen3');
    screen4 = document.getElementById('screen4');
    screen5 = document.getElementById('screen5');
    subjectNameInput = document.getElementById('subjectName');
    subjectAgeInput = document.getElementById('subjectAge');
    subjectEmailInput = document.getElementById('subjectEmail');
    goToScreen2Btn = document.getElementById('goToScreen2Btn');
    startExperimentBtn = document.getElementById('startExperimentBtn');
    canvasContainer = document.getElementById('canvas-container');
    clusterCanvas = document.getElementById('clusterCanvas');
    ctx = clusterCanvas ? clusterCanvas.getContext('2d') : null;
    finishPlacementBtn = document.getElementById('finishPlacementBtn');
    goToFeedbackBtn = document.getElementById('goToFeedbackBtn');
    saveFeedbackAndDataBtn = document.getElementById('saveFeedbackAndDataBtn');
    submitAndFinishBtn = document.getElementById('submitAndFinishBtn');
    loadingSpinner = document.getElementById('loadingSpinner');
    statusMessage = document.getElementById('statusMessage');
    detailsPanel = document.getElementById('details-panel');
    backToScreen1Btn = document.getElementById('backToScreen1Btn');
    backToScreen2Btn = document.getElementById('backToScreen2Btn');
    backToStartBtn2 = document.getElementById('backToStartBtn2');

    if (goToScreen2Btn) {
        goToScreen2Btn.addEventListener('click', () => {
            const name = subjectNameInput.value.trim();
            const ageString = subjectAgeInput.value.trim();
            const email = subjectEmailInput.value.trim();
            if (!name || !ageString || !email) { alert("全ての項目を入力してください。"); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("有効なメールアドレスを入力してください。"); return; }
            const ageNum = parseInt(ageString, 10);
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) { alert("年齢は18歳から99歳の間で、有効な数値を入力してください。"); return; }
            experimentData.subjectInfo = { name, age: ageNum, email };
            if (screen2) { showScreen(screen2); currentMode = 'instructions'; }
        });
    }

    if (startExperimentBtn) {
        startExperimentBtn.addEventListener('click', () => {
            if (!screen3) return;
            showScreen(screen3);
            currentMode = 'placement';
            try { initializeExperiment(); }
            catch (e) { console.error('[CRITICAL_ERROR] Error in initializeExperiment:', e); alert("実験初期化エラー。"); }
        });
    }

    if (finishPlacementBtn) {
        finishPlacementBtn.addEventListener('click', () => {
            if (!clusterCanvas || !goToFeedbackBtn) return;
            currentMode = 'clustering';
            removeActiveDeleteButton();
            experimentData.placementTime = getCurrentTimestamp();
            experimentData.moveHistory.push({ timestamp: experimentData.placementTime, eventType: 'placementEnd', target: 'finishPlacementBtn', details: { message: 'クラスター作成フェーズへ移行' } });
            Object.values(foodContainers).forEach(container => {
                const handle = container.querySelector('.drag-handle');
                if (handle) { handle.style.cursor = 'default'; handle.onmousedown = null; }
            });
            displayFoodDetails(null);
            clusterCanvas.classList.add('active-drawing');
            finishPlacementBtn.style.display = 'none';
            goToFeedbackBtn.style.display = 'inline-block';
            updateStatusMessage('食品を円で囲んでクラスターを作成 (3つ以上中に入れる)、または既存のクラスターをクリックして削除できます。');
        });
    

    if (goToFeedbackBtn) {
        goToFeedbackBtn.addEventListener('click', () => {
            currentMode = 'clusterFeedback';
            removeActiveDeleteButton();
            updateStatusMessage('作成した各クラスターについて、以下の項目を記入してください。');
            if (detailsPanel) {
                detailsPanel.innerHTML = '';
                detailsPanel.scrollTop = 0;
                const placeholder = document.createElement('p');
                placeholder.id = 'details-placeholder';
                placeholder.className = 'info-text';
                detailsPanel.appendChild(placeholder);
                if (experimentData.clusters.length === 0) {
                    placeholder.textContent = '作成されたクラスターはありません。このまま保存してください。';
                    placeholder.style.display = 'block';
                } else {
                    placeholder.style.display = 'none';
                    experimentData.clusters.forEach((cluster, index) => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'cluster-feedback-item';
                        const labels = cluster.items.map(name => (foodList.find(f => f.name === name) || {}).label || name).join('、 ');
                        const itemsText = labels.length > 0 ? ` (内容: ${labels})` : ' (内容なし)';
                        itemDiv.innerHTML = `<h4>クラスター: ${cluster.name}${itemsText}</h4>
                            <label for="reasonCreated_${index}">このクラスターを作成した理由:</label><textarea id="reasonCreated_${index}" data-cluster-index="${index}" data-feedback-type="reasonCreated" rows="3" placeholder="例：これらは「洋食」という点で似ていると感じたため。"></textarea>
                            <label for="meaning_${index}">どのような意味があると思いますか？:</label><textarea id="meaning_${index}" data-cluster-index="${index}" data-feedback-type="meaning" rows="3" placeholder="例：このグループは「子どもが好きな夕食メニュー」と言えるかもしれません。"></textarea>
                            <label for="reasonName_${index}">その名前にした理由:</label><textarea id="reasonName_${index}" data-cluster-index="${index}" data-feedback-type="reasonName" rows="3" placeholder="例：グループの特徴をそのまま名前にしました。"></textarea>`;
                        detailsPanel.appendChild(itemDiv);
                    });
                }
            }
            if(goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
            if(saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'inline-block';
            if(clusterCanvas) clusterCanvas.classList.remove('active-drawing');
            document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'none');
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'enterClusterFeedback', target: 'application', details: { clusterCount: experimentData.clusters.length } });
        });
    }

    if (saveFeedbackAndDataBtn) {
        saveFeedbackAndDataBtn.addEventListener('click', () => {
            let allProvided = true;
            if (experimentData.clusters.length > 0) {
                for (let i = 0; i < experimentData.clusters.length; i++) {
                    const reasonCreatedEl = document.getElementById(`reasonCreated_${i}`);
                    const meaningEl = document.getElementById(`meaning_${i}`);
                    const reasonNameEl = document.getElementById(`reasonName_${i}`);
                    const checkAndMark = (el) => { if (!el || el.value.trim() === '') { allProvided = false; if (el) el.classList.add('feedback-missing'); return false; } else if (el) { el.classList.remove('feedback-missing'); } return true; };
                    checkAndMark(reasonCreatedEl);
                    checkAndMark(meaningEl);
                    checkAndMark(reasonNameEl);
                }
            }
            if (!allProvided) { alert("全てのクラスターについて、3つのフィードバック項目すべてを記入してください。\n（未記入の項目は枠が赤くなっています）"); return; }
            experimentData.clusters.forEach((cluster, index) => {
                cluster.feedback = {
                    reasonCreated: document.getElementById(`reasonCreated_${index}`)?.value.trim() || '',
                    meaning: document.getElementById(`meaning_${index}`)?.value.trim() || '',
                    reasonName: document.getElementById(`reasonName_${index}`)?.value.trim() || ''
                };
            });
            const unknownFoodsContainer = document.getElementById('q12_unknown_foods');
            if (unknownFoodsContainer) {
                unknownFoodsContainer.innerHTML = '';
                foodList.forEach(food => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'unknown_foods[]';
                    checkbox.value = food.name;
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${food.label}`));
                    unknownFoodsContainer.appendChild(label);
                });
            }
            showScreen(screen4);
        });
    }

   // ▼▼▼ このブロックを丸ごと追加 ▼▼▼
if (submitAndFinishBtn) {
    submitAndFinishBtn.addEventListener('click', async (e) => { // (e) の前に async を追加
        e.preventDefault();
        const form = document.getElementById('surveyForm');
        if (!form.checkValidity()) {
            alert('未回答のアンケート項目があります。全ての項目にご回答ください。');
            form.reportValidity();
            return;
        }
        const surveyData = {};
        const formData = new FormData(form);
        for (const [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                const cleanKey = key.slice(0, -2);
                if (!surveyData[cleanKey]) surveyData[cleanKey] = [];
                surveyData[cleanKey].push(value);
            } else {
                surveyData[key] = value;
            }
        }
        if (!surveyData.unknown_foods) {
            surveyData.unknown_foods = [];
        }
        experimentData.survey = surveyData;
        showLoading(true, "データを送信中...");

        try {
            // ★★★ ここに、あなたが発行したGASのウェブアプリURLを貼り付けてください ★★★
            const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbz0bmNUp44bmRt6_HEC1kulC1SAcEhP7VljceEIT4uqrXfb5wA-ICiO2YN1WlPTYvsA/exec'; 

            const dataToSave = { ...experimentData };
            dataToSave.experimentEndTimeISO = new Date().toISOString();
            
            // GASにデータを送信
            await fetch(gasWebAppUrl, {
                method: 'POST',
                mode: 'no-cors', // CORSエラーを回避するためのおまじない
                redirect: 'follow',
                body: JSON.stringify(dataToSave),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                }
            });

            // 成功したら完了画面へ
            showScreen(screen5);

        } catch (error) {
            console.error('[CRITICAL_ERROR] Data submission failed:', error);
            alert('データの送信に失敗しました。管理者にお知らせください。');
        } finally {
            showLoading(false);
        }
    });
}
    if (backToScreen1Btn) {
        backToScreen1Btn.addEventListener('click', () => {
            if (confirm("前の画面に戻りますか？")) {
                showScreen(screen1);
                currentMode = 'intro';
            }
        });
    }
    if (backToScreen2Btn) {
        backToScreen2Btn.addEventListener('click', () => {
            if (confirm("実験説明画面に戻りますか？現在の配置やクラスターの情報はリセットされます。よろしいですか？")) {
                resetScreen3UI();
                showScreen(screen2);
                currentMode = 'instructions';
            }
        });
    }
    if (backToStartBtn2) {
        backToStartBtn2.addEventListener('click', () => {
            if (confirm("最初の画面に戻りますか？")) {
                showScreen(screen1);
                currentMode = 'intro';
            }
        });
    }

    if (clusterCanvas) {
        clusterCanvas.addEventListener('mousedown', handleClusterMouseDown);
        clusterCanvas.addEventListener('click', handleClusterClick);
    }

    try { loadFoodListFromLocalStorage(); } catch (e) { console.error("Error loading food list:", e); }
    try {
        if (screen1) showScreen(screen1); else { console.error("CRITICAL: screen1 not found!"); alert("初期画面エラー"); }
    } catch (e) { console.error("Error showing screen1:", e); }
    console.log("[DEBUG] initializeApp: Finished.");
}

function initializeExperiment() {
    console.log('[DEBUG] initializeExperiment: Started. Current mode is:', currentMode);
    if (currentMode !== 'placement') {
        currentMode = 'placement';
    }
    if (!canvasContainer || !clusterCanvas || (clusterCanvas && !ctx) || !detailsPanel) {
        updateStatusMessage("エラー: 実験エリアの初期化に失敗しました。");
        return;
    }

    try {
        clusterCanvas.width = canvasContainer.clientWidth;
        clusterCanvas.height = canvasContainer.clientHeight;
        ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);

        experimentData.startTime = Date.now();
        experimentData.moveHistory = [];
        experimentData.clusters = [];
        experimentData.positions = [];

        if (detailsPanel) {
            detailsPanel.innerHTML = `<h3 id="details-food-name"></h3><img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;"><div id="details-food-info"></div><p id="details-placeholder" class="info-text" style="display:block;">食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。</p>`;
        }
        displayFoodDetails(null);

        experimentData.moveHistory.push({ timestamp: 0, eventType: 'experimentStart', target: 'experiment', details: { message: '配置フェーズ開始' } });
        canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove());
        removeActiveDeleteButton();
        foodContainers = {};

        foodList.forEach((food) => {
            const foodContainer = document.createElement('div');
            foodContainer.className = 'food-container';
            foodContainer.dataset.name = food.name;

            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            const actionButton = document.createElement('div');
            actionButton.className = 'info-button'; actionButton.textContent = 'i';
            actionButton.title = `${food.label}について`;
            actionButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentMode === 'placement' || currentMode === 'clustering') {
                    displayFoodDetails(food);
                }
            });
            dragHandle.appendChild(actionButton);
            foodContainer.appendChild(dragHandle);

            const img = document.createElement('img');
            img.src = food.imgSrc; img.alt = food.label; img.className = 'food-image';
            img.onerror = () => { img.alt = `${food.label} (画像読込失敗)`; };
            foodContainer.appendChild(img);
            canvasContainer.appendChild(foodContainer);

            const itemW = foodContainer.offsetWidth, itemH = foodContainer.offsetHeight;
            const maxW = canvasContainer.clientWidth, maxH = canvasContainer.clientHeight;
            const buffer = 5;
            let initialX = Math.max(buffer, Math.floor(Math.random() * (maxW - itemW - 2 * buffer)) + buffer);
            let initialY = Math.max(buffer, Math.floor(Math.random() * (maxH - itemH - 2 * buffer)) + buffer);
            if (itemW === 0 || itemH === 0 || maxW <= itemW + 2 * buffer || maxH <= itemH + 2 * buffer) {
                initialX = buffer; initialY = buffer;
            }

            foodContainer.style.left = `${initialX}px`; foodContainer.style.top = `${initialY}px`;
            experimentData.positions.push({ name: food.name, x: initialX, y: initialY });
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'initialPlace', target: food.name, position: { x: initialX, y: initialY } });
            foodContainers[food.name] = foodContainer;
            makeDraggable(foodContainer, dragHandle);
        });
        updateStatusMessage('食品の青いバーをドラッグして自由に配置してください。');
        if (finishPlacementBtn) finishPlacementBtn.style.display = 'inline-block';
        if (goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
        if (saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'none';
        if (clusterCanvas) clusterCanvas.classList.remove('active-drawing');
        document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'auto');
    } catch (error) {
        console.error("[CRITICAL_ERROR] Error within initializeExperiment main block:", error);
        updateStatusMessage("エラー: 食品アイテムの配置中に問題が発生しました。");
    }
    console.log('[DEBUG] initializeExperiment finished.');
}

function makeDraggable(element, handle) {
    if (!element || !handle || !canvasContainer) { return; }
    let isDragging = false, iMouseX, iMouseY, iElemX, iElemY;
    const onMouseDown = (e) => {
        if (currentMode !== 'placement' || e.button !== 0) { handle.style.cursor = 'default'; return; }
        isDragging = true; element.classList.add('dragging'); handle.style.cursor = 'grabbing';
        iMouseX = e.clientX; iMouseY = e.clientY; iElemX = element.offsetLeft; iElemY = element.offsetTop;
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'dragStart', target: element.dataset.name, position: { x: iElemX, y: iElemY } });
    };
    const onMouseMove = (e) => {
        if (!isDragging) return;
        let nX = iElemX + (e.clientX - iMouseX), nY = iElemY + (e.clientY - iMouseY);
        nX = Math.max(0, Math.min(nX, canvasContainer.clientWidth - element.offsetWidth));
        nY = Math.max(0, Math.min(nY, canvasContainer.clientHeight - element.offsetHeight));
        element.style.left = `${nX}px`; element.style.top = `${nY}px`;
    };
    const onMouseUp = () => {
        if (!isDragging) return; isDragging = false; element.classList.remove('dragging');
        handle.style.cursor = (currentMode === 'placement') ? 'grab' : 'default';
        document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
        const fX = element.offsetLeft, fY = element.offsetTop;
        let pE = experimentData.positions.find(p => p.name === element.dataset.name);
        if (pE) { pE.x = fX; pE.y = fY; } else { experimentData.positions.push({ name: element.dataset.name, x: fX, y: fY }); }
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'dragEnd', target: element.dataset.name, position: { x: fX, y: fY } });
    };
    handle.onmousedown = onMouseDown;
    handle.style.cursor = (currentMode === 'placement') ? 'grab' : 'default';
}

function handleClusterMouseDown(e) {
    if (currentMode !== 'clustering' || isDrawingCluster || !clusterCanvas || !ctx) return;
    removeActiveDeleteButton(); isDrawingCluster = true;
    const rect = clusterCanvas.getBoundingClientRect();
    const startX = e.clientX - rect.left, startY = e.clientY - rect.top;
    currentDrawingCluster = {
        id: `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, type: 'circle',
        centerX: startX, centerY: startY, radius: 0,
        name: '', items: [], color: getRandomClusterColor(), feedback: {}
    };
    clusterCanvas.addEventListener('mousemove', handleClusterMouseMove);
    clusterCanvas.addEventListener('mouseup', handleClusterMouseUp);
    clusterCanvas.addEventListener('mouseleave', handleClusterMouseUp);
    experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawStart', target: 'clusterCanvas', details: { type: 'circle', centerX: startX, centerY: startY } });
}

function handleClusterMouseMove(e) {
    if (!isDrawingCluster || !currentDrawingCluster || currentDrawingCluster.type !== 'circle') return;
    const rect = clusterCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left, currentY = e.clientY - rect.top;
    const dx = currentX - currentDrawingCluster.centerX, dy = currentY - currentDrawingCluster.centerY;
    currentDrawingCluster.radius = Math.sqrt(dx * dx + dy * dy);

    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    drawAllClusters();

    const drawingFillColor = currentDrawingCluster.color.startsWith('rgb(') ?
        currentDrawingCluster.color.replace('rgb(', 'rgba(').replace(')', ', 0.1)') :
        `${currentDrawingCluster.color}1A`;

    drawCircle(currentDrawingCluster.centerX, currentDrawingCluster.centerY, currentDrawingCluster.radius, currentDrawingCluster.color, drawingFillColor, 2, true);
}

function handleClusterMouseUp(e) {
    if (!isDrawingCluster || !currentDrawingCluster || currentDrawingCluster.type !== 'circle') return;
    isDrawingCluster = false;
    clusterCanvas.removeEventListener('mousemove', handleClusterMouseMove);
    clusterCanvas.removeEventListener('mouseup', handleClusterMouseUp);
    clusterCanvas.removeEventListener('mouseleave', handleClusterMouseUp);

    if (currentDrawingCluster.radius < 10) {
        updateStatusMessage('クラスターが小さすぎます。もう一度描画してください。');
        currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters(); return;
    }
    identifyItemsInCluster(currentDrawingCluster);
    if (currentDrawingCluster.items.length < 3) {
        updateStatusMessage(`クラスター内の食品が${currentDrawingCluster.items.length}個です。3つ以上になるように作成してください。`);
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawCancel', target: 'clusterCanvas', details: { message: 'Less than 3 items', itemCount: currentDrawingCluster.items.length } });
        currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters(); return;
    }
    const clusterName = prompt("このクラスターの名前を入力してください:", `クラスター${experimentData.clusters.length + 1}`);
    if (clusterName && clusterName.trim() !== "") {
        currentDrawingCluster.name = clusterName.trim();
        experimentData.clusters.push(currentDrawingCluster);
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterCreated', target: currentDrawingCluster.name, details: { id: currentDrawingCluster.id, type: 'circle', radius: currentDrawingCluster.radius, itemCount: currentDrawingCluster.items.length } });
    } else {
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawCancel', target: 'clusterCanvas', details: { message: 'No name provided for circle cluster' } });
    }
    currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters();
}

function identifyItemsInCluster(cluster) {
    if (!cluster || cluster.type !== 'circle' || cluster.radius <= 0) return;
    cluster.items = [];
    Object.values(foodContainers).forEach(container => {
        const rect = container.getBoundingClientRect();
        const cRect = canvasContainer.getBoundingClientRect();
        const iCX = (rect.left - cRect.left) + rect.width / 2, iCY = (rect.top - cRect.top) + rect.height / 2;
        const dX = iCX - cluster.centerX, dY = iCY - cluster.centerY;
        if (Math.sqrt(dX * dX + dY * dY) <= cluster.radius) cluster.items.push(container.dataset.name);
    });
}

function handleClusterClick(e) {
    if (currentMode !== 'clustering' || isDrawingCluster || !clusterCanvas || !ctx || experimentData.clusters.length === 0) return;
    removeActiveDeleteButton(); const rect = clusterCanvas.getBoundingClientRect();
    const cX = e.clientX - rect.left, cY = e.clientY - rect.top;
    let clClicked = null, clIdx = -1;
    for (let i = experimentData.clusters.length - 1; i >= 0; i--) {
        const cl = experimentData.clusters[i];
        if (cl.type === 'circle') {
            const dX_ = cX - cl.centerX, dY_ = cY - cl.centerY;
            if (Math.sqrt(dX_ * dX_ + dY_ * dY_) <= cl.radius) { clClicked = cl; clIdx = i; break; }
        }
    }
    if (clClicked) {
        selectedClusterIndexForDeletion = clIdx;
        createAndShowDeleteButton(clClicked, e.clientX, e.clientY);
    }
}

function createAndShowDeleteButton(cluster, screenX, screenY) {
    removeActiveDeleteButton(); activeDeleteButton = document.createElement('button');
    activeDeleteButton.id = 'dynamicDeleteClusterBtn'; activeDeleteButton.textContent = `「${cluster.name}」を削除`;
    document.body.appendChild(activeDeleteButton);
    activeDeleteButton.style.left = `${screenX + 5}px`; activeDeleteButton.style.top = `${screenY + 5}px`;
    activeDeleteButton.onclick = () => {
        if (selectedClusterIndexForDeletion > -1 && selectedClusterIndexForDeletion < experimentData.clusters.length) {
            const delCl = experimentData.clusters.splice(selectedClusterIndexForDeletion, 1)[0];
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDelete', target: delCl.name, details: { id: delCl.id } });
        }
        selectedClusterIndexForDeletion = -1; removeActiveDeleteButton(); drawAllClusters();
    };
}

function removeActiveDeleteButton() {
    if (activeDeleteButton) { activeDeleteButton.remove(); activeDeleteButton = null; }
}

function drawCircle(centerX, centerY, radius, strokeStyle, fillStyle, lineWidth, isFilled = true) {
    if (!ctx || radius <= 0) return; ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    if (strokeStyle) ctx.strokeStyle = strokeStyle; if (lineWidth) ctx.lineWidth = lineWidth; ctx.stroke();
    if (isFilled && fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
}

function drawAllClusters() {
    if (!ctx || !clusterCanvas) return;
    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    experimentData.clusters.forEach(cluster => {
        if (cluster.type === 'circle' && cluster.radius > 0) {
            const fillColor = cluster.color.startsWith('rgb(') ?
                cluster.color.replace('rgb(', 'rgba(').replace(')', ', 0.2)') :
                `${cluster.color}33`;
            drawCircle(cluster.centerX, cluster.centerY, cluster.radius, cluster.color, fillColor, 2, true);
        }
    });
}

function getRandomClusterColor() {
    const r = Math.floor(Math.random() * 180) + 50; const g = Math.floor(Math.random() * 180) + 50; const b = Math.floor(Math.random() * 180) + 50;
    return `rgb(${r},${g},${b})`;
}

function generateFileName(info) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const subjectName = info && info.name ? info.name.replace(/\s+/g, '_') : 'UnknownSubject';
    return `FoodCognitiveMap_${subjectName}_${dateStr}_${timeStr}.json`;
}

function showLoading(show, message = '') {
    if (!loadingSpinner || !statusMessage) return;
    if (show) { loadingSpinner.classList.add('active'); statusMessage.textContent = message || '読み込み中...'; }
    else { loadingSpinner.classList.remove('active'); }
}

function updateStatusMessage(message) {
    if (!statusMessage) return; statusMessage.textContent = message; console.log(`[STATUS] ${message}`);
}

document.addEventListener('DOMContentLoaded', initializeApp);
