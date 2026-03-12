using System;
using System.Collections.Generic;

namespace ProjectCollab.API.Models;

public partial class Message
{
    public int Id { get; set; }

    public string? Content { get; set; }

    public int? ProjectId { get; set; }

    public int? SenderId { get; set; }

    public DateTime? SentAt { get; set; }
}
