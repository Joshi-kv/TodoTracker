from apscheduler.schedulers.background import BackgroundScheduler
from .cron import update_pending_task

def start() : 
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_pending_task,'cron',hour=11,minute='37')
    scheduler.start()