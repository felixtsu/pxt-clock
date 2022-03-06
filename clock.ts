//% color=#cf6a87 weight=80 icon="\\uf2bb"
namespace clock {

    const clockIcon = img`
        . . . 1 1 1 . . .
        . . 1 . 1 . 1 . .
        . 1 . . 1 . . 1 .
        1 . . . 1 . . . 1
        1 . 1 1 1 . . . 1
        1 . . . . . . . 1
        . 1 . . . . . 1 .
        . . 1 . . . 1 . .
        . . . 1 1 1 . . .
    `

    class Clock {
        hour: number
        minute: number
        tickInterval: number

        currentTimeMinutes: number

        setTimeMillis: number
        setTimeMinutes: number

        constructor(hour: number, minute: number, tickInterval: number) {
            this.hour = hour
            this.minute = minute
            this.tickInterval = tickInterval

            this.currentTimeMinutes = this.hour * 60 + this.minute

            this.setTimeMillis = game.currentScene().millis()
            this.setTimeMinutes = this.currentTimeMinutes
        }

        timeElasped(currentMillis: number) {
            let deltaMillis = currentMillis - this.setTimeMillis
            this.currentTimeMinutes = this.setTimeMinutes + deltaMillis * 60 / this.tickInterval
            this.currentTimeMinutes %= 60 * 24
            this.hour = this.currentTimeMinutes / 60
            this.minute = this.currentTimeMinutes % 60
        }
    }

    let CLOCK_INSTANCE: Clock
    let isDrawClock: boolean = false
    let isDrawClockIcon: boolean = false

    //%blockid=pxtclock_draw_clock block="draw clock %on"
    //%block.loc.zh-CN = "显示时钟 %on"
    export function drawClock(on: boolean) {
        isDrawClock = on
    }
    
    //%blockid=pxtclock_current_hour block="current hour"
    //%block.loc.zh-CN = "现在几点"
    export function currentHour() :number {
        CLOCK_INSTANCE.timeElasped(game.currentScene().millis())
        return CLOCK_INSTANCE.hour
    }

    //%blockid=pxtclock_current_hour block="current minute"
    //%block.loc.zh-CN = "现在几分"
    export function currentMinute(): number {
        CLOCK_INSTANCE.timeElasped(game.currentScene().millis())
        return CLOCK_INSTANCE.minute
    }

    //%blockid=pxtclock_draw_clock_icon block="draw clock icon %on"
    //%block.loc.zh-CN = "显示时钟图标 %on"
    export function drawClockIcon(on: boolean) {
        isDrawClockIcon = on
    }

    //%blockid=pxtclock_set_time block="set time to hour %hour, minute %minute || %tickInterval millis for one minute"
    // %tickInterval.defl=60000
    //%block.loc.zh-CN = "设置时钟 %hour 点 %minute 分 || 以 %tickInterval 毫秒代替一分钟"
    export function setTime(hour: number, minute: number, tickInterval: number = 60000) {
        if (!CLOCK_INSTANCE) {
            CLOCK_INSTANCE = new Clock(hour, minute, tickInterval)
            init()
        }

        CLOCK_INSTANCE.hour = hour
        CLOCK_INSTANCE.minute = minute
        CLOCK_INSTANCE.tickInterval = tickInterval
    }

    function formatDecimal(val: number) {
        val |= 0;
        if (val < 10) {
            return "0" + val;
        }
        return val.toString();
    }

    function drawClockImplement() {
        if (drawClockImplement) {
            const font = image.font8;
            const smallFont = image.font5;
            const clockIconShift = (isDrawClockIcon ? clockIcon.width : 0)
            const width = font.charWidth * 5 - 2 + clockIconShift
            let left = (screen.width >> 1) - (width >> 1);
            let color1 = 1;
            let color2 = 3;

            screen.fillRect(left - 3, 0, width + 6, font.charHeight + 3, color1)
            screen.fillRect(left - 2, 0, width + 4, font.charHeight + 2, color2)

            if (drawClockIcon) {
                screen.drawTransparentImage(clockIcon, left - 1, 1)
            }

            screen.print(formatDecimal(CLOCK_INSTANCE.hour) + ":" + formatDecimal(CLOCK_INSTANCE.minute), left + clockIconShift, 1, color1, font)

        }
    }

    function init() {
        isDrawClock = true
        isDrawClockIcon = true
        scene.createRenderable(
            scene.HUD_Z,
            () => {
                let currentMillis = game.currentScene().millis()
                CLOCK_INSTANCE.timeElasped(currentMillis)
                drawClockImplement()
            }
        )

    }

}