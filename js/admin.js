// 관리자 관련 상수
const ADMIN_PASSWORD = '1234'; // 실제 운영시에는 더 복잡한 비밀번호로 변경하세요
let isAdminLoggedIn = false;

// 제품 데이터
const products = {
    유선카드단말기: {
        name: '유선카드단말기',
        category: '카드단말기',
        imageUrl: 'https://cdn.imweb.me/thumbnail/20250307/47dd13ec4e895.png',
        description: '안정적인 유선 연결로 끊김없는 결제 서비스를 제공하는 카드단말기입니다.',
        detailHtml: ''
    },
    무선카드단말기: {
        name: '무선카드단말기',
        category: '카드단말기',
        imageUrl: 'https://blog.kakaocdn.net/dn/ctbmIM/btsIGJB3gPi/2wvzRASK0sniQVjceZG9hk/img.jpg',
        description: '이동성이 자유로운 무선 카드단말기로, 배터리 지속시간이 길고 언제 어디서나 결제가 가능합니다.',
        detailHtml: ''
    },
    POS시스템: {
        name: 'POS시스템',
        category: 'POS',
        imageUrl: 'https://blog.kakaocdn.net/dn/b6UuXs/btsIJc3rJ0H/ZhZWwDnymTSM3SsXQOdwK1/img.jpg',
        description: '매출 관리, 재고 관리, 고객 데이터 관리까지 한번에 해결할 수 있는 통합 POS 시스템입니다.',
        detailHtml: ''
    },
    키오스크: {
        name: '키오스크',
        category: '키오스크',
        imageUrl: 'https://whee.kr/web/product/big/202303/2db0851b77a8c12483d49c54c25b2d43.png',
        description: '인건비 절감과 효율적인 주문 처리가 가능한 무인 주문 시스템입니다.',
        detailHtml: ''
    },
    태블릿오더: {
        name: '태블릿오더',
        category: '주문시스템',
        imageUrl: 'https://m.heyposmall.com/web/product/medium/202504/ef8e87072ac9921c9c8149bed8b5e5ec.png',
        description: '테이블에서 직접 주문할 수 있는 편리한 시스템입니다.',
        detailHtml: ''
    },
    PG결제시스템: {
        name: 'PG결제시스템',
        category: '결제시스템',
        imageUrl: 'https://bignet.company/data/goods/1/2023/07/143_temp_16905657957541view.jpg',
        description: '온라인 결제를 위한 안전하고 편리한 PG 결제 시스템입니다.',
        detailHtml: ''
    }
};

// 관리자 로그인 패널 표시
function showAdminLogin() {
    document.getElementById('adminPanel').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// 관리자 로그인 처리
function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        alert('로그인 성공!');
        document.getElementById('adminPanel').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('adminDashboard').style.display = 'block';
        loadProductList();
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

// 제품 목록 로드
function loadProductList() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    productList.innerHTML = '';
    Object.entries(products).forEach(([id, product]) => {
        productList.innerHTML += `
            <tr>
                <td class="py-2 px-4 border-b">${product.name}</td>
                <td class="py-2 px-4 border-b">${product.category}</td>
                <td class="py-2 px-4 border-b">
                    <button class="admin-action-btn edit-product-btn" data-product="${id}">수정</button>
                    <button class="admin-action-btn admin-delete-btn" data-product="${id}">삭제</button>
                </td>
            </tr>
        `;
    });

    // 이벤트 리스너 다시 연결
    attachProductEventListeners();
}

// 제품 이벤트 리스너 연결
function attachProductEventListeners() {
    // 수정 버튼
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product');
            openProductEditModal(productId);
        });
    });

    // 삭제 버튼
    document.querySelectorAll('.admin-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product');
            if (confirm('정말로 이 제품을 삭제하시겠습니까?')) {
                deleteProduct(productId);
            }
        });
    });
}

// 제품 수정 모달 열기
function openProductEditModal(productId) {
    const product = products[productId];
    if (!product) return;

    const editPanel = document.getElementById('editPanel');
    if (editPanel) {
        document.getElementById('editTitle').value = product.name;
        document.getElementById('editDescription').value = product.description;
        document.getElementById('previewImage').src = product.imageUrl;
        editPanel.dataset.productId = productId;
        
        editPanel.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }
}

// 제품 정보 저장
function saveProductChanges() {
    const editPanel = document.getElementById('editPanel');
    const productId = editPanel.dataset.productId;
    const product = products[productId];
    
    if (!product) return;

    product.name = document.getElementById('editTitle').value;
    product.description = document.getElementById('editDescription').value;
    const newImageUrl = document.getElementById('previewImage').src;
    if (newImageUrl !== product.imageUrl) {
        product.imageUrl = newImageUrl;
    }

    // UI 업데이트
    updateProductCard(productId);
    loadProductList();

    // 패널 닫기
    closeEditPanel();
    alert('제품 정보가 성공적으로 저장되었습니다.');
}

// 제품 카드 UI 업데이트
function updateProductCard(productId) {
    const product = products[productId];
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const detailBtn = card.querySelector('.product-detail-btn');
        if (detailBtn && detailBtn.getAttribute('data-product') === productId) {
            card.querySelector('.product-title').textContent = product.name;
            card.querySelector('.product-desc').textContent = product.description;
            card.querySelector('.product-image img').src = product.imageUrl;
        }
    });
}

// 제품 삭제
function deleteProduct(productId) {
    if (products[productId]) {
        delete products[productId];
        loadProductList();
        alert('제품이 삭제되었습니다.');
    }
}

// 이미지 업로드 처리
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('이미지 크기는 2MB를 초과할 수 없습니다.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 초기화 함수
document.addEventListener('DOMContentLoaded', () => {
    // 이미지 업로드 이벤트 리스너
    const editImage = document.getElementById('editImage');
    if (editImage) {
        editImage.addEventListener('change', handleImageUpload);
    }

    // 제품 수정 폼 제출 이벤트
    const editPanel = document.getElementById('editPanel');
    if (editPanel) {
        editPanel.querySelector('form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProductChanges();
        });
    }

    // 관리자 로그인 폼 이벤트
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            adminLogin();
        });
    }

    // 모달 닫기 버튼 이벤트
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}); 