from apscheduler.schedulers.background import BackgroundScheduler
from .cron import update_pending_task

def start() : 
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_pending_task,'cron',hour=18,minute='23')
    scheduler.start()