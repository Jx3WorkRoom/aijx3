        var timerIdle = 0;   //空闲时间
        var timerBusy = 0;   //倒计时开始
        var timerIdle1 = 3000;  //系统参数定义超时时间 5*60=300，单位秒
        var timerBusy1 = 2; //退出时间
        function timerTimeout()
        {
            timerIdle++;
            if (timerIdle > timerIdle1)
            {
                if (timerBusy == 0)
                {
                    timerBusy = timerBusy1 + 1;
                }
                timerBusy--;
                if (timerBusy <= 0)
                {
                    timerExit();
                    return;
                }
            }
            else
            {
                timerBusy = 0;
            }
            window.setTimeout("timerTimeout()", 1000);
        }

        function timerUser()
        {
            timerIdle = 0;
        }

        function timerExit()
        {
			//alert("Bye now!"); 
			logoutSystem();
        }

        window.setTimeout("timerTimeout()", 1000);

        function mouseMove(ev)
        {
            ev = ev || window.event;
            timerUser();
            var mousePos = mouseCoords(ev);
        }

        function mouseCoords(ev)
        {
            if (ev.pageX || ev.pageY) {
                return {x:ev.pageX, y:ev.pageY};
            }
            return {
                x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,

                y:ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
        document.onmousemove = mouseMove;
        document.onkeydown = mouseMove;