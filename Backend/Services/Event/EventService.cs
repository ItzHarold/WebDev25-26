using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IEventService
{
    Task<List<Event>> GetAllAsync();
    Task<Event?> GetByIdAsync(int id);
    Task<Event> CreateAsync(Event ev);
    Task<bool> UpdateAsync(int id, Event ev);
    Task<bool> DeleteAsync(int id);
}

public class EventService : IEventService
{
    private readonly AppDbContext _context;

    public EventService(AppDbContext context)
    {
        _context = context;
    }

    // get all events
    public Task<List<Event>> GetAllAsync()
    {
        return _context.Events.ToListAsync();
    }

    // find event by id
    public Task<Event?> GetByIdAsync(int id)
    {
        return _context.Events.FindAsync(id).AsTask();
    }

    // create new event
    public async Task<Event> CreateAsync(Event ev)
    {
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();
        return ev;
    }

    // update event if it exists
    public async Task<bool> UpdateAsync(int id, Event data)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        ev.Title = data.Title;
        ev.Location = data.Location;
        ev.Date = data.Date;
        ev.Description = data.Description;
        ev.Detail = data.Detail;
        ev.Status = data.Status;
        ev.ImageUrl = data.ImageUrl;

        await _context.SaveChangesAsync();
        return true;
    }

    // delete event if found
    public async Task<bool> DeleteAsync(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return true;
    }
}