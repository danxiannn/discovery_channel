

import { supabase, } from './supabase-utils.js'
const container = document.getElementById('scrollContainer');
        
        // 鼠标滚轮：垂直滚动转横向
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        }, { passive: false });
        
        // 鼠标拖拽
        let isDown = false;
        let startX, scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            // 如果按到气球，就不拖动整个场景
            if (e.target.closest('.balloon')) return;

            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => { isDown = false; });
        container.addEventListener('mouseup', () => { isDown = false; });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
        
        // 方向键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') container.scrollLeft += 50;
            if (e.key === 'ArrowLeft') container.scrollLeft -= 50;
        });



const balloon = document.getElementById('balloon');

let dragging = false;
let offsetX = 0;
let offsetY = 0;

let vx = 0;
let vy = 0;
let lastX = 0;
let lastY = 0;
let lastTime = 0;

let animationId = null;

// 按住气球
balloon.addEventListener('mousedown', (e) => {
    dragging = true;
        balloon.classList.remove('flying');
        balloon.classList.add('dragging');

    // 如果气球还在飞，先停下来
    cancelAnimationFrame(animationId);

    const rect = balloon.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = performance.now();

    vx = 0;
    vy = 0;

    e.stopPropagation();
    e.preventDefault();
});

//移动气球
document.addEventListener('mousemove', (e) => {
    if (!dragging) return;

    const scene = balloon.parentElement;
    //获取气球所在的场景
    const sceneRect = balloon.parentElement.getBoundingClientRect();

    // 把鼠标的屏幕坐标换成场景内的坐标
    balloon.style.left =
        (e.clientX - sceneRect.left - offsetX) + 'px';

    balloon.style.top =
        (e.clientY - sceneRect.top - offsetY) + 'px';

// 记录鼠标最近的移动速度
    const now = performance.now();
    const dt = now - lastTime;

    if (dt > 0) {
        vx = (e.clientX - lastX) / dt * 16;
        vy = (e.clientY - lastY) / dt * 16;

        // 限制初始投掷速度，避免飞得过猛
        vx = Math.max(-25, Math.min(25, vx));
        vy = Math.max(-25, Math.min(25, vy));
    }

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
});

    //松开鼠标,扔出气球
    document.addEventListener('mouseup', () => {
        if (!dragging) return;

        dragging = false;

            balloon.classList.remove('dragging');
            balloon.classList.add('flying');    

        throwBalloon();
});

// 气球飞行
function throwBalloon() {
    const scene = balloon.parentElement;

    let x = parseFloat(balloon.style.left) || 0;
    let y = parseFloat(balloon.style.top) || 0;

        // 摇摆参数
        let elapsed = 0;
        let swayAmplitude = 20;

    function animate() {
        if (dragging) return;

        elapsed += 1;

        // 1. 重力：逐渐把气球拉向下方
        vy += 0.18;

        // 2. 空气阻力：逐渐减速（水平和垂直速度逐渐减小）
        vx *= 0.90;
        vy *= 0.90;

        // 更新位置：保留扔出去的方向
        x += vx;
        y += vy;

         // 空气墙：场景左右边界
        const maxX = scene.clientWidth - balloon.offsetWidth;

        if (x < 0) {
            x = 0;
            vx = Math.abs(vx) * 0.75;
        } else if (x > maxX) {
            x = maxX;
            vx = -Math.abs(vx) * 0.75;
        }

        // 空气墙：场景上下边界
        const maxY = scene.clientHeight - balloon.offsetHeight - 120;
                // 100 就是你往上提的距离，数值越大，底部边界越高。

        if (y < 0) {
            y = 0;
            vy = Math.abs(vy) * 0.75;
        } else if (y > maxY) {
            y = maxY;
            vy = -Math.abs(vy) * 0.75;
        }

        balloon.style.left = x + 'px';
        balloon.style.top = y + 'px';

        // 轻微的向上浮力
        vy -= 0.05;

        // 速度足够小时停止
        if (Math.abs(vx) > 0.15 || Math.abs(vy) > 0.15) {
            animationId = requestAnimationFrame(animate);
        }else{
             // 停下来后固定在当前位置
            vx = 0;
            vy = 0;

            // 停止气球的摇摆动画
            balloon.classList.remove('flying');
        }
    }

    animationId = requestAnimationFrame(animate);
}

let tvActiveArray = [];
const tvScreens = document.querySelectorAll(".tv_screen");

for (let i = 0; i < 20; i++) {
    tvActiveArray.push(false)
}


			// change this to the name of your table
			const tableName = 'Discoverychannel';

			let db_result = await supabase
			.from(tableName)
			.select('*')

			const data = db_result.data;
			console.log('data received: ', data);

			const updateDatabase = async (e) => {
				
				const { error } = await supabase
				.from(tableName)
				.insert({
					tv: tvActiveArray,
				});

				if (error) console.error('error inserting data! booooo: ', error);
			}

			const handleReceiveData = (item) => {
                console.log(item)

                tvActiveArray = item.tv;

                tvScreens.forEach((tv, index) => {
                    console.log(tv, item.tv[index])
                    if (item.tv[index] == true) {
                        tv.classList.add("active")
                    } else {
                        tv.classList.remove("active")
                    }
                });
			}

			data?.forEach((item) => {
				handleReceiveData(item);
			});


			// updating without reloading the page

			const channel = supabase
			.channel('guests')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: tableName },
				(payload) => {
					console.log('update! ', payload);
					handleReceiveData(payload.new);
				}
			)
			.subscribe();

            

function toggleTv(tv, index) {
    if (tv.className.indexOf("active") > -1) {
        tv.classList.remove("active")
        tvActiveArray[index] = false
    } else {
        tv.classList.add("active")
        tvActiveArray[index] = true
    }
    updateDatabase();
}




tvScreens.forEach((tv, index) => {
    tv.addEventListener("click", () => {
        toggleTv(tv, index)
    })
});