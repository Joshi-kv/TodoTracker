from apscheduler.schedulers.background import BackgroundScheduler
from .cron import update_pending_task

def start() : 
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_pending_task,'cron',hour=17,minute='59')
    scheduler.start()