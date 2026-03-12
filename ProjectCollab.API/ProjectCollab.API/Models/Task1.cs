using System;
using System.Collections.Generic;

namespace ProjectCollab.API.Models;

public partial class Task1
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? Status { get; set; }

    public int? ProjectId { get; set; }

    public int? AssignedTo { get; set; }
}
