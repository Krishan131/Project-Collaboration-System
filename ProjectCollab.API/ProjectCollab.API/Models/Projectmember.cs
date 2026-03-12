using System;
using System.Collections.Generic;

namespace ProjectCollab.API.Models;

public partial class Projectmember
{
    public int Id { get; set; }

    public int? ProjectId { get; set; }

    public int? UserId { get; set; }
}
