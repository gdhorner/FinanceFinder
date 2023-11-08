using Domain;
using AutoMapper;

namespace Application.Core
{
    public class MappingAccounts : Profile
    {
        public MappingAccounts()
        {
            CreateMap<Account, Account>();
        }

    }
}